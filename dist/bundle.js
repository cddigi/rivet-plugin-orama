// src/nodes/GuidPluginNode.ts
function guidPluginNode(rivet) {
  const GuidPluginNodeImpl = {
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          guid: "",
          uppercase: false,
          version: "v4"
        },
        title: "GUID",
        type: "guidPlugin",
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useUppercase) {
        inputs.push({
          id: "uppercase",
          dataType: "boolean",
          title: "Uppercase"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "guid",
          dataType: "string",
          title: "GUID"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "GUID",
        group: "Text",
        infoBoxBody: "Output a version 1 (date-time and MAC address) or 4 (random) GUID.",
        infoBoxTitle: "GUID Plugin"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "toggle",
          dataKey: "uppercase",
          useInputToggleDataKey: "useUppercase",
          label: "Uppercase"
        },
        {
          type: "dropdown",
          dataKey: "version",
          label: "Version",
          options: [
            { value: "v1", label: "Version 1 (date-time and MAC address)" },
            { value: "v4", label: "Version 4 (random)" },
            { value: "v7", label: "Version 7 (epoch)" }
          ]
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        GUID
        Version: ${data.version}
        Uppercase: ${data.useUppercase ? "(Using Input)" : data.uppercase}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const ver = rivet.getInputOrData(data, inputData, "version", "string");
      const upper = rivet.getInputOrData(
        data,
        inputData,
        "uppercase",
        "boolean"
      );
      if (ver === "v1") {
        const guid = generateUUIDv1();
        if (upper) {
          return {
            ["guid"]: {
              type: "string",
              value: guid.toUpperCase()
            }
          };
        } else {
          return {
            ["guid"]: {
              type: "string",
              value: guid
            }
          };
        }
      } else if (ver === "v4") {
        const guid = generateUUIDv4();
        if (upper) {
          return {
            ["guid"]: {
              type: "string",
              value: guid.toUpperCase()
            }
          };
        } else {
          return {
            ["guid"]: {
              type: "string",
              value: guid
            }
          };
        }
      } else {
        const guid = generateUUIDv7();
        if (upper) {
          return {
            ["guid"]: {
              type: "string",
              value: guid.toUpperCase()
            }
          };
        } else {
          return {
            ["guid"]: {
              type: "string",
              value: guid
            }
          };
        }
      }
    }
  };
  const guidPluginNode2 = rivet.pluginNodeDefinition(
    GuidPluginNodeImpl,
    "Create GUID"
  );
  return guidPluginNode2;
}
function generateUUIDv1() {
  const timestamp = Date.now();
  const machineIdentifier = Math.floor(Math.random() * 16777215);
  return `${timestamp}-${machineIdentifier}-1xxx-yxxx-xxxxxxxxxxxx`.replace(
    /[xy]/g,
    function(c) {
      var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    }
  );
}
function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function toHex(number, length) {
  return number.toString(16).padStart(length, "0");
}
function stringToBytes(str) {
  return Buffer.from(str, "utf-8");
}
function beByteArrayToHexString(bytes) {
  return Array.from(bytes).map((byte) => toHex(byte, 2)).join("");
}
function setVersionAndVariant(u) {
  u[8] = 128 | u[8] & 63;
  u[6] = 112 | u[6] & 15;
}
function generateUUIDv7() {
  const u = new Uint8Array(16);
  const now = Date.now();
  stringToBytes(generateUUIDv4()).copy(u, 6);
  const timeHigh = Math.floor(now / 4294967296);
  const timeLow = now % 4294967296;
  u[0] = timeHigh >> 8 & 255;
  u[1] = timeHigh & 255;
  u[2] = timeLow >> 24 & 255;
  u[3] = timeLow >> 16 & 255;
  u[4] = timeLow >> 8 & 255;
  u[5] = timeLow & 255;
  setVersionAndVariant(u);
  return beByteArrayToHexString(u);
}

// src/index.ts
var plugin = (rivet) => {
  const guidNode = guidPluginNode(rivet);
  const tuesdayCrowdPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "tuesday-crowd-plugin",
    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Tuesday Crowd Plugin",
    // Define all configuration settings in the configSpec object.
    configSpec: {},
    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [],
    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(guidNode);
    }
  };
  return tuesdayCrowdPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
