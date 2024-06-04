// It is important that you only import types from @ironclad/rivet-core, and not
// any of the actual Rivet code. Rivet is passed into the initializer function as
// a parameter, and you can use it to access any Rivet functionality you need.
import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";

import { insertVectorPluginNode } from "./nodes/InsertVectorNode.js";
import { createDatabasePluginNode } from "./nodes/CreateDatabaseNode.js";
import { searchDatabasePluginNode } from "./nodes/SearchDatabaseNode.js";

// A Rivet plugin must default export a plugin initializer function. This takes in the Rivet library as its
// only parameter. This function must return a valid RivetPlugin object.
const plugin: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const insertVectorNode = insertVectorPluginNode(rivet);
  const createDatabaseNode = createDatabasePluginNode(rivet);
  const searchDatabaseNode = searchDatabasePluginNode(rivet);

  // The plugin object is the definition for your plugin.
  const oramaPlugin: RivetPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "orama-plugin",

    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Orama Plugin",

    // Define all configuration settings in the configSpec object.
    configSpec: {},

    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "orama",
        label: "Orama",
      },
    ],

    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(insertVectorNode);
      register(createDatabaseNode);
      register(searchDatabaseNode);
    },
  };

  // Make sure to return your plugin definition.
  return oramaPlugin;
};

// Make sure to default export your plugin.
export default plugin;
