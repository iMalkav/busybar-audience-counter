import {
  record,
  str,
  num,
  requiredNumber,
  requiredText,
  entries,
  compact,
  Feed,
  type View,
} from "./lib.ts";

export class AppModel extends Feed {
  receive(value: unknown, now: number): void {
    const data = record(value);
    const items = entries(data.channels).map((raw) => {
      const v = record(raw);
      const count = requiredNumber(v.count);
      if (!Number.isSafeInteger(count) || count < 0)
        throw new Error("Invalid audience count");
      return { name: requiredText(v.name, 64), count };
    });
    this.commit(
      items,
      now,
      data.updated_at === undefined ? now : data.updated_at,
    );
  }
  view(now: number): View {
    if (!this.items.length) return this.empty("Audience", now);
    const v = this.items[this.selected];
    return this.feedView(
      str(v, "name"),
      compact(num(v, "count")),
      [
        String(num(v, "count")) + " followers",
        this.selected + 1 + " / " + this.items.length,
      ],
      now,
    );
  }
}
