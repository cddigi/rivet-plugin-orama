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

import { insert } from "@orama/orama";
import { vdb } from "./CreateDatabaseNode";

export type AddVectorNode = ChartNode<
  "addVector",
  {
    id: string;
    useIdInput?: boolean;
    embedding: number[];
    useEmbeddingInput?: boolean;
    text: string;
    useTextInput?: boolean;
  }
>;

export const addVectorPluginNode = (rivet: typeof Rivet) => {
  const impl: PluginNodeImpl<AddVectorNode> = {
    create(): AddVectorNode {
      const node: AddVectorNode = {
        id: rivet.newId<NodeId>(),

        data: {
          id: "",
          embedding: [],
          text: "",
        },
        title: "Add Vector Embedding",
        type: "addVector",
        visualData: {
          x: 0,
          y: 0,
          width: 200,
        },
      };

      return node;
    },

    getInputDefinitions(
      data,
      _connections,
      _nodes,
      _project,
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useIdInput) {
        inputs.push({
          id: "id" as PortId,
          dataType: "string",
          title: "ID",
          required: true,
        });
      }

      if (data.useEmbeddingInput) {
        inputs.push({
          id: "embedding" as PortId,
          dataType: "vector",
          title: "Embedding",
          required: true,
        });
      }

      if (data.useTextInput) {
        inputs.push({
          id: "text" as PortId,
          dataType: "string",
          title: "Text",
          required: true,
        });
      }

      return inputs;
    },

    getOutputDefinitions(
      _data,
      _connections,
      _nodes,
      _project,
    ): NodeOutputDefinition[] {
      return [
        {
          id: "id" as PortId,
          dataType: "string",
          title: "ID",
        },
        {
          id: "score" as PortId,
          dataType: "number",
          title: "Score",
        },
        {
          id: "embedding" as PortId,
          dataType: "vector",
          title: "Embedding",
        },
      ];
    },

    getUIData(_context): NodeUIData {
      return {
        contextMenuTitle: "Add Vector",
        group: "Vector DB",
        infoBoxBody:
          "This is a node for adding text to the in-memory vector database.",
        infoBoxTitle: "Add Vector Node",
      };
    },

    getEditors(_data): EditorDefinition<AddVectorNode>[] {
      return [
        {
          type: "string",
          dataKey: "id",
          label: "ID",
          useInputToggleDataKey: "useIdInput",
        },
        {
          type: "anyData",
          dataKey: "embedding",
          label: "Embedding",
          useInputToggleDataKey: "useEmbeddingInput",
        },
      ];
    },

    getBody(
      data,
      _context,
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Add Vector Node
        ID: ${data.id}
        Vector: [${data.embedding}]
      `;
    },

    async process(data, inputData, _context): Promise<Outputs> {
      const embedding = rivet.getInputOrData(
        data,
        inputData,
        "embedding",
        "vector",
        "useEmbeddingInput",
      );

      const id = rivet.getInputOrData(
        data,
        inputData,
        "id",
        "string",
        "useIdInput",
      );

      const text = rivet.getInputOrData(
        data,
        inputData,
        "text",
        "string",
        "useTextInput",
      );

      const added = await insert(vdb, {
        name: id,
        body: text,
        embedding: embedding,
      });

      return {
        ["id" as PortId]: {
          type: "string",
          value: added,
        },
      };
    },
  };

  return rivet.pluginNodeDefinition(impl, "Add Vector");
};
