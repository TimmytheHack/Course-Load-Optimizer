"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DAYS, ScheduleBlock } from "@/lib/types";
import { getTimetableWindow } from "@/lib/schedule";
import { formatDayList, formatHours, formatTimeLabel, safeDateLabel } from "@/lib/utils";

interface TimetableProps {
  classBlocks: ScheduleBlock[];
  commitmentBlocks: ScheduleBlock[];
}

const STEP_MINUTES = 60;
const MIN_BLOCK_HEIGHT = 8;
const DENSITY_OPTIONS = {
  compact: { label: "Compact", pixelsPerHour: 46 },
  comfortable: { label: "Comfortable", pixelsPerHour: 54 },
  expanded: { label: "Expanded", pixelsPerHour: 62 },
} as const;

type BlockDensity = "short" | "medium" | "tall";
type TimetableDensity = keyof typeof DENSITY_OPTIONS;

interface PositionedBlock extends ScheduleBlock {
  column: number;
  columnCount: number;
  density: BlockDensity;
}

function clampLines(lines: number) {
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as const,
    WebkitLineClamp: lines,
    overflow: "hidden",
  };
}

function getBlockDensity(block: ScheduleBlock, columnCount: number): BlockDensity {
  const durationMinutes = block.endMinutes - block.startMinutes;

  if (columnCount > 1) {
    if (durationMinutes >= 120) {
      return "medium";
    }

    return "short";
  }

  if (durationMinutes >= 120) {
    return "tall";
  }

  if (durationMinutes >= 75) {
    return "medium";
  }

  return "short";
}

function positionDayBlocks(dayBlocks: ScheduleBlock[]) {
  const sorted = [...dayBlocks].sort(
    (left, right) =>
      left.startMinutes - right.startMinutes || left.endMinutes - right.endMinutes,
  );
  const groups: ScheduleBlock[][] = [];
  let currentGroup: ScheduleBlock[] = [];
  let currentGroupEnd = -1;

  sorted.forEach((block) => {
    if (currentGroup.length === 0 || block.startMinutes < currentGroupEnd) {
      currentGroup.push(block);
      currentGroupEnd = Math.max(currentGroupEnd, block.endMinutes);
      return;
    }

    groups.push(currentGroup);
    currentGroup = [block];
    currentGroupEnd = block.endMinutes;
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups.flatMap((group) => {
    const columnEnds: number[] = [];
    const assigned = group.map((block) => {
      let column = columnEnds.findIndex((endMinutes) => endMinutes <= block.startMinutes);

      if (column === -1) {
        column = columnEnds.length;
      }

      columnEnds[column] = block.endMinutes;
      return {
        block,
        column,
      };
    });

    const columnCount = Math.max(1, columnEnds.length);

    return assigned.map(({ block, column }) => ({
      ...block,
      column,
      columnCount,
      density: getBlockDensity(block, columnCount),
    }));
  });
}

export function Timetable({ classBlocks, commitmentBlocks }: TimetableProps) {
  const blocks = useMemo(
    () => [...classBlocks, ...commitmentBlocks],
    [classBlocks, commitmentBlocks],
  );
  const timetableWindow = getTimetableWindow(blocks);
  const totalMinutes = timetableWindow.end - timetableWindow.start;
  const totalHours = totalMinutes / 60;
  const [density, setDensity] = useState<TimetableDensity>("comfortable");
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [pinnedBlockId, setPinnedBlockId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const dayColumnHeight = Math.round(
    totalHours * DENSITY_OPTIONS[density].pixelsPerHour,
  );
  const hours = Array.from(
    { length: Math.ceil(totalMinutes / STEP_MINUTES) + 1 },
    (_, index) => timetableWindow.start + index * STEP_MINUTES,
  );
  const positionedBlocksByDay = useMemo(
    () =>
      Object.fromEntries(
        DAYS.map((day) => [
          day,
          positionDayBlocks(
            blocks
              .filter((block) => block.day === day)
              .sort((left, right) => left.startMinutes - right.startMinutes),
          ),
        ]),
      ) as Record<(typeof DAYS)[number], PositionedBlock[]>,
    [blocks],
  );
  const positionedBlocks = useMemo(
    () => DAYS.flatMap((day) => positionedBlocksByDay[day]),
    [positionedBlocksByDay],
  );
  const blockMap = useMemo(
    () => new Map(positionedBlocks.map((block) => [block.id, block])),
    [positionedBlocks],
  );
  const overlapMap = useMemo(() => {
    const next = new Map<string, string[]>();

    positionedBlocks.forEach((block, index) => {
      for (let compareIndex = index + 1; compareIndex < positionedBlocks.length; compareIndex += 1) {
        const compare = positionedBlocks[compareIndex];

        if (block.day !== compare.day) {
          continue;
        }

        if (
          block.startMinutes < compare.endMinutes &&
          compare.startMinutes < block.endMinutes
        ) {
          next.set(block.id, [...(next.get(block.id) ?? []), compare.id]);
          next.set(compare.id, [...(next.get(compare.id) ?? []), block.id]);
        }
      }
    });

    return next;
  }, [positionedBlocks]);
  const activeDetailId = pinnedBlockId ?? hoveredBlockId;
  const activeBlock = activeDetailId ? blockMap.get(activeDetailId) ?? null : null;
  const overlappingBlocks = activeBlock
    ? (overlapMap.get(activeBlock.id) ?? [])
        .map((blockId) => blockMap.get(blockId))
        .filter((block): block is PositionedBlock => Boolean(block))
        .sort((left, right) => left.startMinutes - right.startMinutes)
    : [];

  useEffect(() => {
    if (pinnedBlockId && !blockMap.has(pinnedBlockId)) {
      setPinnedBlockId(null);
    }

    if (hoveredBlockId && !blockMap.has(hoveredBlockId)) {
      setHoveredBlockId(null);
    }
  }, [blockMap, hoveredBlockId, pinnedBlockId]);

  useEffect(() => {
    if (!pinnedBlockId) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPinnedBlockId(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [pinnedBlockId]);

  useEffect(
    () => () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    },
    [],
  );

  function clearHoverTimeout() {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }

  function queueHoveredBlock(blockId: string | null, delay = 80) {
    clearHoverTimeout();

    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredBlockId(blockId);
      hoverTimeoutRef.current = null;
    }, delay);
  }

  function handleBlockClick(blockId: string) {
    clearHoverTimeout();
    setPinnedBlockId((current) => (current === blockId ? null : blockId));
    setHoveredBlockId(blockId);
  }

  if (blocks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-500">
        Assign a few courses to the active plan to render the weekly timetable.
      </div>
    );
  }

  return (
    <div
      className="space-y-3"
      onMouseLeave={() => {
        if (!pinnedBlockId) {
          queueHoveredBlock(null, 90);
        }
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            Class block
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            Commitment block
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            Window: {formatTimeLabel(`${String(Math.floor(timetableWindow.start / 60)).padStart(2, "0")}:${String(timetableWindow.start % 60).padStart(2, "0")}`)} - {formatTimeLabel(`${String(Math.floor(timetableWindow.end / 60)).padStart(2, "0")}:${String(timetableWindow.end % 60).padStart(2, "0")}`)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(DENSITY_OPTIONS) as Array<[TimetableDensity, (typeof DENSITY_OPTIONS)[TimetableDensity]]>).map(
            ([option, config]) => (
              <button
                key={option}
                type="button"
                onClick={() => setDensity(option)}
                className={[
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition motion-reduce:transition-none",
                  density === option
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900",
                ].join(" ")}
              >
                {config.label}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="h-[220px] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/96 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.07)] backdrop-blur sm:h-[236px]">
        <div className="flex h-full flex-col">
          {activeBlock ? (
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {pinnedBlockId ? "Pinned details" : "Hover preview"}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {activeBlock.kind === "course" ? "Course" : "Commitment"}
                    </span>
                    {overlappingBlocks.length > 0 ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        Overlap at this time
                      </span>
                    ) : null}
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-slate-950">
                    {activeBlock.title}
                  </h4>
                </div>
                {pinnedBlockId ? (
                  <button
                    type="button"
                    onClick={() => setPinnedBlockId(null)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 motion-reduce:transition-none"
                  >
                    Close
                  </button>
                ) : null}
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                    Days: {formatDayList(activeBlock.sourceDays)}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                    Time: {formatTimeLabel(activeBlock.startTime)} - {formatTimeLabel(activeBlock.endTime)}
                  </span>
                  {activeBlock.kind === "course" && activeBlock.workloadHours !== undefined ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                      Workload: {formatHours(activeBlock.workloadHours)} / week
                    </span>
                  ) : null}
                  {activeBlock.kind === "course" && activeBlock.difficulty ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                      Difficulty: {activeBlock.difficulty}
                    </span>
                  ) : null}
                  {activeBlock.kind === "course" && activeBlock.requirement ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                      Requirement: {activeBlock.requirement}
                    </span>
                  ) : null}
                  {activeBlock.kind === "commitment" && activeBlock.category ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                      Category: {activeBlock.category}
                    </span>
                  ) : null}
                </div>

                {activeBlock.kind === "course" &&
                activeBlock.deadlines &&
                activeBlock.deadlines.length > 0 ? (
                  <div className="mt-3 rounded-[20px] border border-slate-200 bg-slate-50/80 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Deadlines
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeBlock.deadlines.map((deadline) => (
                        <span
                          key={deadline.id}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                          {deadline.title} · {safeDateLabel(deadline.date)}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {overlappingBlocks.length > 0 ? (
                  <div className="mt-3 rounded-[20px] border border-amber-200 bg-amber-50/80 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                      Also in this time slot
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {[activeBlock, ...overlappingBlocks].map((block) => (
                        <div
                          key={block.id}
                          className="rounded-2xl border border-amber-200/80 bg-white/90 px-3 py-2.5"
                        >
                          <p className="text-xs font-medium text-slate-500">
                            {block.kind === "course" ? "Course" : "Commitment"}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">{block.title}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            {formatTimeLabel(block.startTime)} - {formatTimeLabel(block.endTime)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {pinnedBlockId
                  ? "Pinned. Press Escape or close to dismiss."
                  : "Hover for a quick preview, or click a block to pin full details."}
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    Hover preview
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    Click to pin
                  </span>
                </div>
                <h4 className="mt-2 text-base font-semibold text-slate-950">
                  Inspect any timetable block
                </h4>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                  Hover to preview the full course or commitment details. Click any block to pin a stable panel for closer inspection.
                </p>
              </div>
              <p className="text-xs text-slate-500">
                The panel height stays fixed so the timetable never shifts while you inspect blocks.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto rounded-[26px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.82),rgba(255,255,255,0.96))] p-2 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="grid min-w-[920px] grid-cols-[72px_repeat(7,minmax(108px,1fr))] gap-px rounded-[22px] bg-slate-200">
        <div className="bg-slate-50" />
        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-slate-50 px-3 py-2.5 text-center text-sm font-semibold text-slate-700"
          >
            {day}
          </div>
        ))}

        <div className="relative bg-white">
          {hours.map((time) => (
            <div
              key={time}
              className="absolute inset-x-0 border-t border-dashed border-slate-300 px-2.5 text-[11px] text-slate-500"
              style={{ top: `${((time - timetableWindow.start) / totalMinutes) * 100}%` }}
            >
              <span className="-translate-y-1/2 block rounded-full bg-white/95 pr-2 font-medium">
                {formatTimeLabel(`${String(Math.floor(time / 60)).padStart(2, "0")}:00`)}
              </span>
            </div>
          ))}
        </div>

        {DAYS.map((day) => {
          const positionedBlocks = positionedBlocksByDay[day];

          return (
            <div key={day} className="relative bg-white" style={{ height: `${dayColumnHeight}px` }}>
              {hours.map((time) => (
                <div
                  key={time}
                  className="absolute inset-x-0 border-t border-dashed border-slate-200/90"
                  style={{ top: `${((time - timetableWindow.start) / totalMinutes) * 100}%` }}
                />
              ))}
              {positionedBlocks.map((block) => {
                const top = ((block.startMinutes - timetableWindow.start) / totalMinutes) * 100;
                const height = ((block.endMinutes - block.startMinutes) / totalMinutes) * 100;
                const width = 100 / block.columnCount;
                const left = width * block.column;
                const horizontalInset = block.columnCount > 1 ? 3 : 6;
                const densityClasses =
                  block.density === "tall"
                    ? "gap-1"
                    : block.density === "medium"
                      ? "gap-0.5"
                      : "gap-0";
                const titleLineClamp =
                  block.density === "tall" ? 2 : block.density === "medium" ? 2 : 1;
                const showKindLabel = block.density === "tall";
                const showTime = block.density !== "short";
                const showConflictTone = block.columnCount > 1;

                return (
                  <button
                    key={block.id}
                    type="button"
                    onMouseEnter={() => {
                      if (!pinnedBlockId) {
                        queueHoveredBlock(block.id, 90);
                      }
                    }}
                    onFocus={() => {
                      clearHoverTimeout();
                      setHoveredBlockId(block.id);
                    }}
                    onClick={() => handleBlockClick(block.id)}
                    aria-pressed={pinnedBlockId === block.id}
                    aria-label={`${block.title}, ${block.kind}, ${day}, ${formatTimeLabel(
                      block.startTime,
                    )} to ${formatTimeLabel(block.endTime)}`}
                    className={[
                      "absolute overflow-hidden rounded-2xl border px-2.5 py-2 text-left shadow-sm transition duration-150 ease-out motion-reduce:transition-none",
                      block.color,
                      "ring-1 ring-black/5",
                      block.kind === "commitment" ? "saturate-[0.86]" : "",
                      showConflictTone ? "shadow-[0_10px_24px_rgba(15,23,42,0.12)]" : "",
                      activeDetailId === block.id
                        ? "z-10 -translate-y-0.5 ring-2 ring-slate-900/18 shadow-[0_14px_30px_rgba(15,23,42,0.16)]"
                        : "hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(15,23,42,0.12)] focus-visible:z-10 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/18",
                    ].join(" ")}
                    style={{
                      top: `${top}%`,
                      height: `${Math.max(height, MIN_BLOCK_HEIGHT)}%`,
                      left: `calc(${left}% + ${horizontalInset}px)`,
                      width: `calc(${width}% - ${horizontalInset * 2}px)`,
                    }}
                  >
                    <div className={["relative flex h-full flex-col text-current", densityClasses].join(" ")}>
                      {showKindLabel ? (
                        <p className="text-[10px] font-medium tracking-[0.08em] opacity-70">
                          {block.kind === "course" ? "Class" : "Commitment"}
                        </p>
                      ) : null}
                      <p
                        className={[
                          "font-semibold leading-snug text-current",
                          block.density === "short" ? "text-[12px]" : "text-[13px]",
                        ].join(" ")}
                        style={clampLines(titleLineClamp)}
                        title={block.title}
                      >
                        {block.title}
                      </p>
                      {showTime ? (
                        <p
                          className="text-[11px] font-medium opacity-80"
                          style={clampLines(1)}
                        >
                          {formatTimeLabel(block.startTime)} - {formatTimeLabel(block.endTime)}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
