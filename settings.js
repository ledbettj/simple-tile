/* jshint esversion: 6 */
const Gio  = imports.gi.Gio;
const Me   = imports.misc.extensionUtils.getCurrentExtension();

function settings(path) {
  let source = Gio.SettingsSchemaSource.new_from_directory(
    Me.path,
    Gio.SettingsSchemaSource.get_default(),
    false
  );
  let schema = source.lookup('io.throttle.SimpleTile', false);

  return new Gio.Settings({ settings_schema: schema });
}