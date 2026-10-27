import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const devices = pgTable("devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  deviceType: text("device_type").notNull(),
  ipAddress: text("ip_address").notNull(),
  status: text("status").notNull(),
  location: text("location"),
  macAddress: text("mac_address"),
  lastPing: timestamp("last_ping", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Device = typeof devices.$inferSelect;
export type NewDevice = typeof devices.$inferInsert;

