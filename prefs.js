const GLib    = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio     = imports.gi.Gio;
const Gtk     = imports.gi.Gtk;

const SimpleTileSettingsWidget = new GObject.Class({
  Name: 'SimpleTile.Prefs.SimpleTileSettingsWidget',
  GTypeName: 'SimpleTileSettingsWidget',
  Extends: Gtk.Box,

  _init: function(params) {
    this.parent(params);
  }

});

function init() {}

function buildPrefsWidget() {
  let widget = new SimpleTileSettingsWidget();
  widget.show_all();
  return widget;
}

