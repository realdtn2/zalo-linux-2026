#!/usr/bin/env python3
"""Take a screenshot through org.freedesktop.portal.Screenshot and print its path.

Why this exists as a separate process: the portal answers asynchronously with a Response
signal delivered to the *same* D-Bus connection that made the request. `gdbus call` opens a
connection, sends the request and exits, so the reply is delivered to a name that no longer
exists and is lost. This keeps one connection open for both halves.

Uses PyGObject (python3-gi), which is part of a normal desktop install — the app ships no
node_modules and has no build step, so an npm D-Bus binding is not an option.

stdout: the screenshot path on success. Exit codes: 0 ok, 2 denied/cancelled, 3 error.
"""
import sys
import urllib.parse

import gi

gi.require_version("Gio", "2.0")
from gi.repository import Gio, GLib  # noqa: E402

TIMEOUT_MS = 120000  # generous: this window includes the one-time permission dialog


def main() -> int:
    bus = Gio.bus_get_sync(Gio.BusType.SESSION, None)
    loop = GLib.MainLoop()
    result = {"uri": None, "code": None}

    # The request object path is derived from our unique bus name, so we can subscribe to the
    # exact Response before issuing the call and avoid racing it.
    token = "zalocap_%d" % abs(hash(bus.get_unique_name()))
    sender = bus.get_unique_name()[1:].replace(".", "_")
    path = "/org/freedesktop/portal/desktop/request/%s/%s" % (sender, token)

    def on_response(_conn, _sender, _path, _iface, _signal, params):
        result["code"] = params[0]
        opts = params[1]
        if "uri" in opts:
            result["uri"] = opts["uri"]
        loop.quit()

    bus.signal_subscribe(
        "org.freedesktop.portal.Desktop",
        "org.freedesktop.portal.Request",
        "Response",
        path,
        None,
        Gio.DBusSignalFlags.NONE,
        on_response,
    )

    options = {
        "interactive": GLib.Variant("b", False),
        "handle_token": GLib.Variant("s", token),
    }
    try:
        bus.call_sync(
            "org.freedesktop.portal.Desktop",
            "/org/freedesktop/portal/desktop",
            "org.freedesktop.portal.Screenshot",
            "Screenshot",
            GLib.Variant("(sa{sv})", ("", options)),
            GLib.VariantType("(o)"),
            Gio.DBusCallFlags.NONE,
            -1,
            None,
        )
    except GLib.Error as exc:
        sys.stderr.write("portal call failed: %s\n" % exc.message)
        return 3

    GLib.timeout_add(TIMEOUT_MS, lambda: (loop.quit(), False)[1])
    loop.run()

    if result["code"] != 0 or not result["uri"]:
        sys.stderr.write("portal response code=%s\n" % result["code"])
        return 2

    uri = result["uri"]
    if uri.startswith("file://"):
        uri = urllib.parse.unquote(uri[7:])
    sys.stdout.write(uri + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
