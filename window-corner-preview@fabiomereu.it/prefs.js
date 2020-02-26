// Global modules
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

// Internal modules
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

const WindowCornerSettings = Settings.WindowCornerSettings;

function init() {
    // Nothing
}

const WindowCornerPreview332PrefsWidget = new GObject.Class({
    Name: "WindowCornerPreview.Prefs.Widget",
    GTypeName: "WindowCornerPreviewPrefsWidget",
    Extends: Gtk.VBox,

    _init: function(params) {
        this.parent(params);

        this.margin = 24;
        this.spacing = 6;

        const settings = new WindowCornerSettings();

        // 1. Behavior

        this.add(new Gtk.Label({
            label: "<b>Behavior when mouse is over</b>",
            use_markup: true,
            xalign: 0.0,
            yalign: 0.0
        }));

        let boxBehavior = new Gtk.VBox({
            spacing: 6,
            margin_top: 6,
            margin_left: 12
        });


        const behaviors = [
            {
                mode: "seethrough",
                label: "See-through (one click to drive it away)"
            },
            {
                mode: "autohide",
                label: "Hide-and-seek (vanish and turn up automatically)"
            }
        ];

        const currentBehaviorMode = settings.behaviorMode;

        let radio = null;

        behaviors.forEach(function (behavior) {

            radio = new Gtk.RadioButton({
                active: behavior.mode === currentBehaviorMode,
                label: behavior.label,
                group: radio,
                sensitive: true
            });

            radio.connect("toggled", Lang.bind(this, function(button) {
                if (button.active) {
                    settings.behaviorMode = behavior.mode;
                }
            }));

            boxBehavior.add(radio);
        });

        this.add(boxBehavior);

        // 2. Hide on top

        let checkHideOnFocus = new Gtk.CheckButton({
            label: "Hide when the mirrored window is on top",
            active: settings.focusHidden
        });

        checkHideOnFocus.connect("toggled", function(button) {
            settings.focusHidden = button.active;
        });

        let boxHideOnFocus = new Gtk.VBox({margin_top: 12});

        boxHideOnFocus.add(checkHideOnFocus);
        this.add(boxHideOnFocus);

        // How to use
        [
            "<i>Keep pressed</i> <b>SHIFT</b> <i>to prevent it from disappearing</i>",
            "<i>Use</i> <b>LEFT</b>, <b>MIDDLE</b> <i>or</i> <b>RIGHT</b> <i>button to move it</i>",
            "<b>SHIFT</b> + <b>CLICK</b> <i>to activate the mirrored window</i>",
            "<u><i>" + Me.metadata.url + "</i></u>" // github
        ].forEach(function(label) {
            this.add(new Gtk.Label({
                label: label,
                use_markup: true,
                xalign: 1.0,
                yalign: 0.0
            }));
        }, this);
    }
});

function buildPrefsWidget() {
    let widget = new WindowCornerPreview332PrefsWidget();
    widget.show_all();

    return widget;
}
