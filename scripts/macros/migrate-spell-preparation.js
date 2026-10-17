// Run as the active GM to reapply preparation fixes to all RoS actors and unlinked scene tokens.
(async () => {
  const { migrateSpellPreparation } = await import("/modules/ros5e/scripts/modules/migrations.js");
  await migrateSpellPreparation({ force: true });
})().catch(error => {
  console.error("ROS5E progression update failed:", error);
  ui.notifications.error(error.message);
});
