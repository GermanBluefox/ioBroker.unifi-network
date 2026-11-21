/**
 * The answer of the message `help`: what the instance answers, written for an AI agent (e.g. ioBroker.pi-agent, or
 * the MCP server with `send_to`) and for script authors. Keep it in sync with `onMessage` in main.ts and the README.
 */

/**
 * One command which `onMessage` answers; `write` = it changes something, `standard` = the command follows the shared
 * catalog of commands for adapter families (`<family>.<command>`)
 */
export interface HelpCommand {
    command: string;
    write: boolean;
    standard?: string;
}

/** The commands `onMessage` answers */
export const COMMANDS: HelpCommand[] = [
    { command: 'help', write: false },
    { command: 'getClients', write: false, standard: 'network.getClients' },
    { command: 'clientList', write: false },
    { command: 'deviceList', write: false },
    { command: 'wlanList', write: false },
    { command: 'lanList', write: false },
    { command: 'firewallGroupList', write: false },
    { command: 'clientStateList', write: false },
    { command: 'deviceStateList', write: false },
    { command: 'wlanStateList', write: false },
    { command: 'lanStateList', write: false },
    { command: 'firewallGroupStateList', write: false },
];

export const HELP = `ioBroker.unifi-network: connects to a UniFi Network application (UniFi OS console or controller) and mirrors its
UniFi devices (gateway, switches, access points), clients, WLANs, LANs and firewall groups as states, updated in
real time. An agent can see which clients are online and where, and control the network by writing states: block a
client, switch a WLAN or the internet access of a LAN, restart a device, switch PoE ports.

Commands (sendTo unifi-network.0):
- getClients {online?}: follows the shared catalog of commands (network.getClients), the same for every network
  adapter: the clients and guests as the adapter knows them now, sorted by name: {clients: [{mac, name, ip?,
  online, wired, accessPoint? (name of the access point of a WLAN client), guest?}]}; online true = only the
  connected ones. VPN clients are not listed. {error, reason: "NOT_CONNECTED"} before the first connection.
The lists below answer [{label, value}] sorted by label; each is read once and kept until the adapter restarts
(new clients are missing, empty if asked before the connection):
- clientList: the clients: label "<name> (<mac>)", value = the MAC (the ID part of clients.users.<mac>).
- deviceList: the UniFi devices: label "<name> (<mac>)", value = the MAC (devices.<mac>).
- wlanList: the WLANs: label = the name (SSID), value = the id (wlan.<id>).
- lanList: the networks: label = "<name> (VLAN: <vlan>)", value = the id (lan.<id>).
- firewallGroupList: the firewall groups: label = the name, value = the id (firewall.groups.<id>).
- clientStateList, deviceStateList, wlanStateList, lanStateList, firewallGroupStateList: for the settings (the
  states to leave out), not for agents.

States (unifi-network.0.*), commands are written with ack false; states appear only after the controller sent the
data, and the settings may leave states or clients out:
- clients.users.<mac>.* and clients.guests.<mac>.* (guest network), clients.vpn.<ip with _>.*: isOnline, name, ip,
  ... name (write: renames the client in the controller), blocked (true / false: blocks / unblocks the client in the
  whole network), reconnect (button, only WLAN clients: disconnects it, it connects again).
- devices.<mac>.*: isOnline, name, ...; restart (button), upgrade (button, only if upgradable is true), led_override
  (on, off, default), disabled (access points: true switches it off); ports.port_<nn>.enable (switch port on /
  off), poe_enable, poe_cycle (button: cuts the PoE power for a moment); radio.<n>.tx_power_mode (low, medium,
  high, auto, disabled, custom); wan1 / wan2.speedtest_run (button, gateway) with speedtest_download / upload.
- wlan.<id>.enabled (true / false switches the WLAN), connected_clients, connected_guests.
- lan.<id>.enabled (the network), lan.<id>.internet_enabled (internet access of the network), connected_clients.
- firewall.groups.<id>.name, group_members (JSON array of addresses or ports; writing replaces the members).
- info.connection (connected to the controller), info.version, info.upgradable.
A write that the controller refuses only appears in the log of the adapter; read the state again to check.

How to talk to the user:
- Name clients and devices by their name, not by MAC or id; find the MAC with getClients / deviceList.
- Only on the user's explicit request and after confirmation: blocked, reconnect, switching off a WLAN, a LAN, its
  internet access, a port or PoE (cameras and access points lose power), restart, upgrade, disabled, tx_power_mode
  and firewall group changes. Warn that the ioBroker host itself or the agent's own connection may be cut off.`;
