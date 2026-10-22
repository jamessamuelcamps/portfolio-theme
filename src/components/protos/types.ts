/** Timeline types for ProtoStage demos. */
export interface ProtoEntry {
  /** ms from the start of the loop */
  at: number;
  /** data-* attributes to set on the screen (keys without the data- prefix) */
  set?: Record<string, string>;
  /** selector, inside the screen, of an element to show a tap on */
  tap?: string;
  /** a drag: the ring lands on the target's centre (+ ox/oy), travels dx/dy
      and lifts off, all in design px. The move runs from 15% to 85% of ms
      (default 900), so a demo can time its own scroll to match. */
  swipe?: { target: string; dx?: number; dy?: number; ox?: number; oy?: number; ms?: number };
}

export interface ProtoChapter {
  label: string;
  /** where playback jumps to from this chapter's control */
  at: number;
  /** the representative frame shown when paused or under reduced motion */
  key: number;
}
