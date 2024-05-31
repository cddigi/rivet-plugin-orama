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
import { insert } from "@orama/orama";

export type InsertVectorNode = ChartNode<
  "insertVector",
  {
    vdb?: AnyOrama;
    useVdbInput?: boolean;
    title: string;
    useTitleInput?: boolean;
    embedding: number[];
    useEmbeddingInput?: boolean;
    text: string;
    useTextInput?: boolean;
  }
>;

export const insertVectorPluginNode = (rivet: typeof Rivet) => {
  const impl: PluginNodeImpl<InsertVectorNode> = {
    create(): InsertVectorNode {
      const node: InsertVectorNode = {
        id: rivet.newId<NodeId>(),

        data: {
          vdb: undefined,
          title: "",
          embedding: [],
          text: "",
        },
        title: "Insert Vector Embedding",
        type: "insertVector",
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

      if (data.useVdbInput) {
        inputs.push({
          id: "vdb" as PortId,
          dataType: "any",
          title: "Database",
          required: true,
        });
      }

      if (data.useTitleInput) {
        inputs.push({
          id: "title" as PortId,
          dataType: "string",
          title: "Title",
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
      ];
    },

    getUIData(_context): NodeUIData {
      return {
        contextMenuTitle: "Insert Vector",
        group: "Orama",
        infoBoxBody:
          "This is a node for inserting text to the in-memory vector database.",
        infoBoxTitle: "Insert Vector Node",
      };
    },

    getEditors(_data): EditorDefinition<InsertVectorNode>[] {
      return [
        {
          type: "string",
          dataKey: "title",
          label: "Title",
          useInputToggleDataKey: "useTitleInput",
        },
        {
          type: "anyData",
          dataKey: "embedding",
          label: "Embedding",
          useInputToggleDataKey: "useEmbeddingInput",
        },
        {
          type: "anyData",
          dataKey: "vdb",
          label: "VDB",
          useInputToggleDataKey: "useVdbInput",
        },
      ];
    },

    getBody(
      data,
      _context,
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        Insert Vector Node
        ID: ${data.title}
        Vector: [${data.embedding}]
      `;
    },

    async process(data, inputData, _context): Promise<Outputs> {
      const vdb = rivet.getInputOrData(
        data,
        inputData,
        "vdb",
        "any",
        "useVdbInput",
      ) as AnyOrama;

      const embedding = rivet.getInputOrData(
        data,
        inputData,
        "embedding",
        "vector",
        "useEmbeddingInput",
      );

      const name = rivet.getInputOrData(
        data,
        inputData,
        "title",
        "string",
        "useTitleInput",
      );

      const text = rivet.getInputOrData(
        data,
        inputData,
        "text",
        "string",
        "useTextInput",
      );

      const id = await insert(vdb, {
        name: name,
        body: text,
        embedding: embedding,
      });

      return {
        ["id" as PortId]: {
          type: "string",
          value: id,
        },
      };
    },
  };

  return rivet.pluginNodeDefinition(impl, "Insert Vector");
};
