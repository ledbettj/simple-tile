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
  'tile-switch-monitor',
  'tile-full'
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


var SimpleTile = class SimpleTile {

  constructor(settings) {
    this.settings = settings;
    this.keybindings = {};
    this.signals = [];
  }

  startup() {
    this.getScreenGeometry();
    this.registerKeybindings();
    this.connectSignals();
  }

  shutdown() {
    this.unregisterKeybindings();
    this.disconnectSignals();
  }

  getScreenGeometry() {
    let displayCount = Main.layoutManager.monitors.length,
        primary      = Main.layoutManager.primaryIndex;

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
  }

  getWindowMonitor(window) {
    return this.screens[window.get_monitor()];
  }

  nextMonitor(index) {
    return this.screens[(index + 1) % this.screens.length];
  }

  registerKeybindings() {
    KEYBINDINGS.forEach(function(binding) {
      var handler = binding.split('-').join('_');
      Main.wm.addKeybinding(
        binding,
        this.settings,
        Meta.KeyBindingFlags.NONE,
        Shell.ActionMode.NORMAL,
        this[handler].bind(this)
      );
    }, this);
  }

  unregisterKeybindings() {
    KEYBINDINGS.forEach(function(binding) {
      Main.wm.removeKeybinding(binding);
    });
  }

  tile_left_top() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x,
      screen.y,
      screen.w / 2,
      screen.h / 2
    );
  }

  tile_right_top() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x + screen.w / 2,
      screen.y,
      screen.w / 2, screen.h / 2
    );
  }

  tile_left_bottom() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x,
      screen.y + screen.h / 2,
      screen.w / 2,
      screen.h / 2
    );
  }

  tile_right_bottom() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x + screen.w / 2,
      screen.y + screen.h / 2,
      screen.w / 2,
      screen.h / 2
    );
  }

  tile_left_full() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x,
      screen.y,
      screen.w / 2,
      screen.h
    );
  }

  tile_right_full() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x + screen.w / 2,
      screen.y,
      screen.w / 2,
      screen.h
    );
  }

  tile_top_full() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(false, screen.x, screen.y, screen.w, screen.h / 2);
  }

  tile_bottom_full() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x + screen.w / 2,
      screen.y + screen.h / 2,
      screen.w,
      screen.h / 2
    );
  }

  tile_switch_monitor() {
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
  }

  tile_full() {
    let window = global.display.focus_window;
    let screen = this.getWindowMonitor(window);

    window.move_resize_frame(
      false,
      screen.x,
      screen.y,
      screen.w,
      screen.h
    );
  }

  connectSignals() {
    this.signals.push(
      Main.layoutManager.connect('monitors-changed', this.getScreenGeometry.bind(this))
    );
  }

  disconnectSignals() {
    this.signals.forEach(function(signal) {
      Main.layoutManager.disconnect(signal);
    });
    this.signals = [];
  }

};
