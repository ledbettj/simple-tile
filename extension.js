/* jshint esversion: 6 */
var app = null;

const Lang = imports.lang;
const Meta = imports.gi.Meta;
const Gio  = imports.gi.Gio;
const Main = imports.ui.main;
const Me   = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const Shell = imports.gi.Shell;

const KEYBINDINGS = [
  'tile-left-top',
  'tile-left-full',
  'tile-left-bottom',
  'tile-right-top',
  'tile-right-full',
  'tile-right-bottom',
  'tile-top-full',
  'tile-bottom-full',
  'tile-switch-monitor'
];

function init() {
}

function enable() {
  app = new SimpleTile(Settings.settings());
  app.startup();
}

function disable() {
  app.shutdown();
  app = null;
}


function SimpleTile(settings) {
  this.settings = settings;
  this.keybindings = {};
}


SimpleTile.prototype.startup = function() {
  this.getScreenGeometry();
  this.registerKeybindings();
};

SimpleTile.prototype.shutdown = function() {
  this.unregisterKeybindings();
};

SimpleTile.prototype.getScreenGeometry = function() {
  let displayCount = global.screen.get_n_monitors(),
      primary      = global.screen.get_primary_monitor();

  this.screens = [];

  for(let i = 0; i < displayCount; ++i) {
    let geo = Main.layoutManager.getWorkAreaForMonitor(i);
    this.screens[i] = {
      x: geo.x,
      y: geo.y,
      w: geo.width,
      h: geo.height
    };
  }

  this.primaryScreen = this.screens[primary];
};

SimpleTile.prototype.nextMonitor = function(index) {
  return this.screens[(index + 1) % this.screens.length];
};

SimpleTile.prototype.registerKeybindings = function() {
  KEYBINDINGS.forEach(function(binding) {
    var handler = binding.split('-').join('_');
    Main.wm.addKeybinding(
      binding,
      this.settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.NORMAL | Shell.ActionMode.MESSAGE_TRAY,
      Lang.bind(this, this[handler])
    );
  }, this);
};

SimpleTile.prototype.unregisterKeybindings = function() {
  KEYBINDINGS.forEach(function(binding) {
    Main.wm.removeKeybinding(binding);
  });
};

SimpleTile.prototype.tile_left_top = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;
  window.move_resize_frame(
    false,
    screen.x,
    screen.y,
    screen.w / 2,
    screen.h / 2
  );
};

SimpleTile.prototype.tile_right_top = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;

  window.move_resize_frame(
    false,
    screen.x + screen.w / 2,
    screen.y,
    screen.w / 2, screen.h / 2
  );
};

SimpleTile.prototype.tile_left_bottom = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;

  window.move_resize_frame(
    false,
    screen.x,
    screen.y + screen.h / 2,
    screen.w / 2,
    screen.h / 2
  );
};

SimpleTile.prototype.tile_right_bottom = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;
  window.move_resize_frame(
    false,
    screen.x + screen.w / 2,
    screen.y + screen.h / 2,
    screen.w / 2,
    screen.h / 2
  );
};

SimpleTile.prototype.tile_left_full = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;
  window.move_resize_frame(
    false,
    screen.x,
    screen.y,
    screen.w / 2,
    screen.h
  );
};

SimpleTile.prototype.tile_right_full = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;
  window.move_resize_frame(
    false,
    screen.x + screen.w / 2,
    screen.y,
    screen.w / 2,
    screen.h
  );
};

SimpleTile.prototype.tile_top_full = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;
  window.move_resize_frame(false, screen.x, screen.y, screen.w, screen.h / 2);
};

SimpleTile.prototype.tile_bottom_full = function() {
  let window = global.display.focus_window;
  let screen = this.primaryScreen;
  window.move_resize_frame(
    false,
    screen.x + screen.w / 2,
    screen.y + screen.h / 2,
    screen.w,
    screen.h / 2
  );
};

SimpleTile.prototype.tile_switch_monitor = function() {
  let window       = global.display.focus_window;
  let monitorIndex = window.get_monitor();
  let rect         = window.get_frame_rect();
  let oldScreen    = this.screens[monitorIndex];
  let newScreen    = this.nextMonitor(monitorIndex);

  let xscale = newScreen.w  / oldScreen.w;
  let yscale = newScreen.h / oldScreen.h;
  let xoff   = rect.x - oldScreen.x;
  let yoff   = rect.y - oldScreen.y;

  window.move_resize_frame(
    false,
    Math.floor(newScreen.x + xoff * xscale),
    Math.floor(newScreen.y + yoff * yscale),
    Math.floor(rect.width  * xscale),
    Math.floor(rect.height * yscale)
  );
};
