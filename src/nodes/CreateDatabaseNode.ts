import type {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";

import type { AnyOrama } from "@orama/orama";
import { create } from "@orama/orama";

// This defines your new type of node.
export type CreateDatebasePluginNode = ChartNode<
  "createDatabasePlugin",
  CreateDatebasePluginNodeData
>;

// This defines the data that your new node will store.
export type CreateDatebasePluginNodeData = {
  vdb?: AnyOrama;
  vectorSize: number;
  useVectorSizeInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export function createDatabasePluginNode(rivet: typeof Rivet) {
  const CreateDatebasePluginNodeImpl: PluginNodeImpl<CreateDatebasePluginNode> =
    {
      create(): CreateDatebasePluginNode {
        const node: CreateDatebasePluginNode = {
          id: rivet.newId<NodeId>(),
          data: {
            vdb: undefined,
            vectorSize: 0,
          },
          title: "In-Memory Db",
          type: "createDatabasePlugin",
          visualData: {
            x: 0,
            y: 0,
            width: 200,
          },
        };
        return node;
      },

      // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
      // connection, nodes, and project are for advanced use-cases and can usually be ignored.
      getInputDefinitions(
        data: CreateDatebasePluginNodeData,
        _connections: NodeConnection[],
        _nodes: Record<NodeId, ChartNode>,
        _project: Project,
      ): NodeInputDefinition[] {
        const inputs: NodeInputDefinition[] = [];

        if (data.useVectorSizeInput) {
          inputs.push({
            id: "vectorSize" as PortId,
            dataType: "number",
            title: "Size",
            required: true,
          });
        }
        return inputs;
      },

      // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
      // connection, nodes, and project are for advanced use-cases and can usually be ignored.
      getOutputDefinitions(
        _data: CreateDatebasePluginNodeData,
        _connections: NodeConnection[],
        _nodes: Record<NodeId, ChartNode>,
        _project: Project,
      ): NodeOutputDefinition[] {
        return [
          {
            id: "vdb" as PortId,
            dataType: "any",
            title: "Database",
          },
        ];
      },

      // This returns UI information for your node, such as how it appears in the context menu.
      getUIData(): NodeUIData {
        return {
          contextMenuTitle: "Orama Database",
          group: "Orama",
          infoBoxBody: "Orama in-memory database.",
          infoBoxTitle: "Orama Create Plugin",
        };
      },

      // This function defines all editors that appear when you edit your node.
      getEditors(
        _data: CreateDatebasePluginNodeData,
      ): EditorDefinition<CreateDatebasePluginNode>[] {
        return [
          {
            type: "number",
            dataKey: "vectorSize",
            useInputToggleDataKey: "useVectorSizeInput",
            label: "Vector Length",
          },
        ];
      },

      // This function returns the body of the node when it is rendered on the graph. You should show
      // what the current data of the node is in some way that is useful at a glance.
      getBody(
        _data: CreateDatebasePluginNodeData,
      ): string | NodeBodySpec | NodeBodySpec[] | undefined {
        return rivet.dedent`
          Orama Vector DB
          `;
      },

      // This is the main processing function for your node. It can do whatever you like, but it must return
      // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
      // must also correspond to the output definitions you defined in the getOutputDefinitions function.
      async process(
        data: CreateDatebasePluginNodeData,
        inputData: Inputs,
        _context: InternalProcessContext,
      ): Promise<Outputs> {
        const size = rivet.getInputOrData(
          data,
          inputData,
          "vectorSize",
          "number",
          "useVectorSizeInput",
        );

        let vdb = await create({
          schema: {
            name: "string",
            body: "string",
            embedding: `vector[${size}]`,
          },
          id: "vdb",
        });

        return {
          ["vdb" as PortId]: {
            type: "any",
            value: vdb,
          },
        };
      },
    };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.
  const createDatabasePluginNode = rivet.pluginNodeDefinition(
    CreateDatebasePluginNodeImpl,
    "Create Orama Database",
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return createDatabasePluginNode;
}
