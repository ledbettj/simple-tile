# SimpleTile

A simple tiling extension for Gnome Shell that (omg) works on the most
recent version (currently 3.22.2).  SimpleTile does not do any automatic
tiling -- instead it allows you to move the focused window to a particular
grid position.

Still a work in progress.

## Installation

Clone to the shell extensions folder:

```
cd ~/.local/share/gnome-shell/extensions/
git clone https://github.com/ledbettj/simple-tile.git SimpleTile@throttle.io
```

Activate in `gnome-tweak-tool`.

Use `Super+KeyPad<N>` to move the focused window.  For example,
`Super+KeyPad3` will move the focused window to the bottom right quadrant.
`Super+KeyPad<Enter>` will move the window to the next monitor.


## Status

This is a really simple, early version.  Currently it supports:

* Moving the focused window to a quarter/half of a screen
* Making the focused window full sized
* Moving the focused window between monitors, preserving size/placement.

Current limitations:

* no configuration panel.  This means keybindings are not easily configurable.
* Does not work on windows that are maximized or "half maximized" via Super+LeftArrow, etc.
* Does not have the ability to move window focus via keypad.
