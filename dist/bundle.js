// src/nodes/common/GuidPluginNode.ts
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
    function(c2) {
      var r = Math.random() * 16 | 0, v2 = c2 === "x" ? r : r & 3 | 8;
      return v2.toString(16);
    }
  );
}
function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c2) {
    var r = Math.random() * 16 | 0, v2 = c2 === "x" ? r : r & 3 | 8;
    return v2.toString(16);
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

// node_modules/@orama/orama/dist/components/tokenizer/languages.js
var STEMMERS = {
  arabic: "ar",
  armenian: "am",
  bulgarian: "bg",
  danish: "dk",
  dutch: "nl",
  english: "en",
  finnish: "fi",
  french: "fr",
  german: "de",
  greek: "gr",
  hungarian: "hu",
  indian: "in",
  indonesian: "id",
  irish: "ie",
  italian: "it",
  lithuanian: "lt",
  nepali: "np",
  norwegian: "no",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "rs",
  slovenian: "ru",
  spanish: "es",
  swedish: "se",
  tamil: "ta",
  turkish: "tr",
  ukrainian: "uk",
  sanskrit: "sk"
};
var SPLITTERS = {
  dutch: /[^A-Za-zàèéìòóù0-9_'-]+/gim,
  english: /[^A-Za-zàèéìòóù0-9_'-]+/gim,
  french: /[^a-z0-9äâàéèëêïîöôùüûœç-]+/gim,
  italian: /[^A-Za-zàèéìòóù0-9_'-]+/gim,
  norwegian: /[^a-z0-9_æøåÆØÅäÄöÖüÜ]+/gim,
  portuguese: /[^a-z0-9à-úÀ-Ú]/gim,
  russian: /[^a-z0-9а-яА-ЯёЁ]+/gim,
  spanish: /[^a-z0-9A-Zá-úÁ-ÚñÑüÜ]+/gim,
  swedish: /[^a-z0-9_åÅäÄöÖüÜ-]+/gim,
  german: /[^a-z0-9A-ZäöüÄÖÜß]+/gim,
  finnish: /[^a-z0-9äöÄÖ]+/gim,
  danish: /[^a-z0-9æøåÆØÅ]+/gim,
  hungarian: /[^a-z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+/gim,
  romanian: /[^a-z0-9ăâîșțĂÂÎȘȚ]+/gim,
  serbian: /[^a-z0-9čćžšđČĆŽŠĐ]+/gim,
  turkish: /[^a-z0-9çÇğĞıİöÖşŞüÜ]+/gim,
  lithuanian: /[^a-z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ]+/gim,
  arabic: /[^a-z0-9أ-ي]+/gim,
  nepali: /[^a-z0-9अ-ह]+/gim,
  irish: /[^a-z0-9áéíóúÁÉÍÓÚ]+/gim,
  indian: /[^a-z0-9अ-ह]+/gim,
  armenian: /[^a-z0-9ա-ֆ]+/gim,
  greek: /[^a-z0-9α-ωά-ώ]+/gim,
  indonesian: /[^a-z0-9]+/gim,
  ukrainian: /[^a-z0-9а-яА-ЯіїєІЇЄ]+/gim,
  slovenian: /[^a-z0-9čžšČŽŠ]+/gim,
  bulgarian: /[^a-z0-9а-яА-Я]+/gim,
  tamil: /[^a-z0-9அ-ஹ]+/gim,
  sanskrit: /[^a-z0-9A-Zāīūṛḷṃṁḥśṣṭḍṇṅñḻḹṝ]+/gim
};
var SUPPORTED_LANGUAGES = Object.keys(STEMMERS);
function getLocale(language) {
  return language !== void 0 && SUPPORTED_LANGUAGES.includes(language) ? STEMMERS[language] : void 0;
}

// node_modules/@orama/orama/dist/utils.js
var baseId = Date.now().toString().slice(5);
var lastId = 0;
var nano = BigInt(1e3);
var milli = BigInt(1e6);
var second = BigInt(1e9);
var MAX_ARGUMENT_FOR_STACK = 65535;
function safeArrayPush(arr, newArr) {
  if (newArr.length < MAX_ARGUMENT_FOR_STACK) {
    Array.prototype.push.apply(arr, newArr);
  } else {
    const newArrLength = newArr.length;
    for (let i = 0; i < newArrLength; i += MAX_ARGUMENT_FOR_STACK) {
      Array.prototype.push.apply(arr, newArr.slice(i, i + MAX_ARGUMENT_FOR_STACK));
    }
  }
}
function sprintf(template, ...args) {
  return template.replace(/%(?:(?<position>\d+)\$)?(?<width>-?\d*\.?\d*)(?<type>[dfs])/g, function(...replaceArgs) {
    const groups = replaceArgs[replaceArgs.length - 1];
    const { width: rawWidth, type, position } = groups;
    const replacement = position ? args[Number.parseInt(position) - 1] : args.shift();
    const width = rawWidth === "" ? 0 : Number.parseInt(rawWidth);
    switch (type) {
      case "d":
        return replacement.toString().padStart(width, "0");
      case "f": {
        let value = replacement;
        const [padding, precision] = rawWidth.split(".").map((w) => Number.parseFloat(w));
        if (typeof precision === "number" && precision >= 0) {
          value = value.toFixed(precision);
        }
        return typeof padding === "number" && padding >= 0 ? value.toString().padStart(width, "0") : value.toString();
      }
      case "s":
        return width < 0 ? replacement.toString().padEnd(-width, " ") : replacement.toString().padStart(width, " ");
      default:
        return replacement;
    }
  });
}
async function formatNanoseconds(value) {
  if (typeof value === "number") {
    value = BigInt(value);
  }
  if (value < nano) {
    return `${value}ns`;
  } else if (value < milli) {
    return `${value / nano}\u03BCs`;
  } else if (value < second) {
    return `${value / milli}ms`;
  }
  return `${value / second}s`;
}
async function uniqueId() {
  return `${baseId}-${lastId++}`;
}
function getOwnProperty(object, property) {
  if (Object.hasOwn === void 0) {
    return Object.prototype.hasOwnProperty.call(object, property) ? object[property] : void 0;
  }
  return Object.hasOwn(object, property) ? object[property] : void 0;
}
function intersect(arrays) {
  if (arrays.length === 0) {
    return [];
  } else if (arrays.length === 1) {
    return arrays[0];
  }
  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i].length < arrays[0].length) {
      const tmp = arrays[0];
      arrays[0] = arrays[i];
      arrays[i] = tmp;
    }
  }
  const set = /* @__PURE__ */ new Map();
  for (const elem of arrays[0]) {
    set.set(elem, 1);
  }
  for (let i = 1; i < arrays.length; i++) {
    let found = 0;
    for (const elem of arrays[i]) {
      const count2 = set.get(elem);
      if (count2 === i) {
        set.set(elem, count2 + 1);
        found++;
      }
    }
    if (found === 0)
      return [];
  }
  return arrays[0].filter((e) => {
    const count2 = set.get(e);
    if (count2 !== void 0)
      set.set(e, 0);
    return count2 === arrays.length;
  });
}
async function getDocumentProperties(doc, paths) {
  const properties = {};
  const pathsLength = paths.length;
  for (let i = 0; i < pathsLength; i++) {
    const path = paths[i];
    const pathTokens = path.split(".");
    let current = doc;
    const pathTokensLength = pathTokens.length;
    for (let j = 0; j < pathTokensLength; j++) {
      current = current[pathTokens[j]];
      if (typeof current === "object") {
        if (current !== null && "lat" in current && "lon" in current && typeof current.lat === "number" && typeof current.lon === "number") {
          current = properties[path] = current;
          break;
        } else if (!Array.isArray(current) && current !== null && j === pathTokensLength - 1) {
          current = void 0;
          break;
        }
      } else if ((current === null || typeof current !== "object") && j < pathTokensLength - 1) {
        current = void 0;
        break;
      }
    }
    if (typeof current !== "undefined") {
      properties[path] = current;
    }
  }
  return properties;
}
var mapDistanceToMeters = {
  cm: 0.01,
  m: 1,
  km: 1e3,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344
};
function convertDistanceToMeters(distance, unit) {
  const ratio = mapDistanceToMeters[unit];
  if (ratio === void 0) {
    throw new Error(createError("INVALID_DISTANCE_SUFFIX", distance).message);
  }
  return distance * ratio;
}

// node_modules/@orama/orama/dist/errors.js
var allLanguages = SUPPORTED_LANGUAGES.join("\n - ");
var errors = {
  NO_LANGUAGE_WITH_CUSTOM_TOKENIZER: "Do not pass the language option to create when using a custom tokenizer.",
  LANGUAGE_NOT_SUPPORTED: `Language "%s" is not supported.
Supported languages are:
 - ${allLanguages}`,
  INVALID_STEMMER_FUNCTION_TYPE: `config.stemmer property must be a function.`,
  MISSING_STEMMER: `As of version 1.0.0 @orama/orama does not ship non English stemmers by default. To solve this, please explicitly import and specify the "%s" stemmer from the package @orama/stemmers. See https://docs.oramasearch.com/open-source/text-analysis/stemming for more information.`,
  CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY: "Custom stop words array must only contain strings.",
  UNSUPPORTED_COMPONENT: `Unsupported component "%s".`,
  COMPONENT_MUST_BE_FUNCTION: `The component "%s" must be a function.`,
  COMPONENT_MUST_BE_FUNCTION_OR_ARRAY_FUNCTIONS: `The component "%s" must be a function or an array of functions.`,
  INVALID_SCHEMA_TYPE: `Unsupported schema type "%s" at "%s". Expected "string", "boolean" or "number" or array of them.`,
  DOCUMENT_ID_MUST_BE_STRING: `Document id must be of type "string". Got "%s" instead.`,
  DOCUMENT_ALREADY_EXISTS: `A document with id "%s" already exists.`,
  DOCUMENT_DOES_NOT_EXIST: `A document with id "%s" does not exists.`,
  MISSING_DOCUMENT_PROPERTY: `Missing searchable property "%s".`,
  INVALID_DOCUMENT_PROPERTY: `Invalid document property "%s": expected "%s", got "%s"`,
  UNKNOWN_INDEX: `Invalid property name "%s". Expected a wildcard string ("*") or array containing one of the following properties: %s`,
  INVALID_BOOST_VALUE: `Boost value must be a number greater than, or less than 0.`,
  INVALID_FILTER_OPERATION: `You can only use one operation per filter, you requested %d.`,
  SCHEMA_VALIDATION_FAILURE: `Cannot insert document due schema validation failure on "%s" property.`,
  INVALID_SORT_SCHEMA_TYPE: `Unsupported sort schema type "%s" at "%s". Expected "string" or "number".`,
  CANNOT_SORT_BY_ARRAY: `Cannot configure sort for "%s" because it is an array (%s).`,
  UNABLE_TO_SORT_ON_UNKNOWN_FIELD: `Unable to sort on unknown field "%s". Allowed fields: %s`,
  SORT_DISABLED: `Sort is disabled. Please read the documentation at https://docs.oramasearch for more information.`,
  UNKNOWN_GROUP_BY_PROPERTY: `Unknown groupBy property "%s".`,
  INVALID_GROUP_BY_PROPERTY: `Invalid groupBy property "%s". Allowed types: "%s", but given "%s".`,
  UNKNOWN_FILTER_PROPERTY: `Unknown filter property "%s".`,
  INVALID_VECTOR_SIZE: `Vector size must be a number greater than 0. Got "%s" instead.`,
  INVALID_VECTOR_VALUE: `Vector value must be a number greater than 0. Got "%s" instead.`,
  INVALID_INPUT_VECTOR: `Property "%s" was declared as a %s-dimensional vector, but got a %s-dimensional vector instead.
Input vectors must be of the size declared in the schema, as calculating similarity between vectors of different sizes can lead to unexpected results.`,
  WRONG_SEARCH_PROPERTY_TYPE: `Property "%s" is not searchable. Only "string" properties are searchable.`,
  FACET_NOT_SUPPORTED: `Facet doens't support the type "%s".`,
  INVALID_DISTANCE_SUFFIX: `Invalid distance suffix "%s". Valid suffixes are: cm, m, km, mi, yd, ft.`,
  INVALID_SEARCH_MODE: `Invalid search mode "%s". Valid modes are: "fulltext", "vector", "hybrid".`,
  MISSING_VECTOR_AND_SECURE_PROXY: `No vector was provided and no secure proxy was configured. Please provide a vector or configure an Orama Secure Proxy to perform hybrid search.`,
  MISSING_TERM: `"term" is a required parameter when performing hybrid search. Please provide a search term.`,
  INVALID_VECTOR_INPUT: `Invalid "vector" property. Expected an object with "value" and "property" properties, but got "%s" instead.`,
  PLUGIN_CRASHED: `A plugin crashed during initialization. Please check the error message for more information:`
};
function createError(code, ...args) {
  const error = new Error(sprintf(errors[code] ?? `Unsupported Orama Error code: ${code}`, ...args));
  error.code = code;
  if ("captureStackTrace" in Error.prototype) {
    Error.captureStackTrace(error);
  }
  return error;
}

// node_modules/@orama/orama/dist/components/defaults.js
async function formatElapsedTime(n) {
  return {
    raw: Number(n),
    formatted: await formatNanoseconds(n)
  };
}
async function getDocumentIndexId(doc) {
  if (doc.id) {
    if (typeof doc.id !== "string") {
      throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof doc.id);
    }
    return doc.id;
  }
  return await uniqueId();
}
async function validateSchema(doc, schema) {
  for (const [prop, type] of Object.entries(schema)) {
    const value = doc[prop];
    if (typeof value === "undefined") {
      continue;
    }
    if (type === "geopoint" && typeof value === "object" && typeof value.lon === "number" && typeof value.lat === "number") {
      continue;
    }
    if (type === "enum" && (typeof value === "string" || typeof value === "number")) {
      continue;
    }
    if (type === "enum[]" && Array.isArray(value)) {
      const valueLength = value.length;
      for (let i = 0; i < valueLength; i++) {
        if (typeof value[i] !== "string" && typeof value[i] !== "number") {
          return prop + "." + i;
        }
      }
      continue;
    }
    if (isVectorType(type)) {
      const vectorSize = getVectorSize(type);
      if (!Array.isArray(value) || value.length !== vectorSize) {
        throw createError("INVALID_INPUT_VECTOR", prop, vectorSize, value.length);
      }
      continue;
    }
    if (isArrayType(type)) {
      if (!Array.isArray(value)) {
        return prop;
      }
      const expectedType = getInnerType(type);
      const valueLength = value.length;
      for (let i = 0; i < valueLength; i++) {
        if (typeof value[i] !== expectedType) {
          return prop + "." + i;
        }
      }
      continue;
    }
    if (typeof type === "object") {
      if (!value || typeof value !== "object") {
        return prop;
      }
      const subProp = await validateSchema(value, type);
      if (subProp) {
        return prop + "." + subProp;
      }
      continue;
    }
    if (typeof value !== type) {
      return prop;
    }
  }
  return void 0;
}
var IS_ARRAY_TYPE = {
  string: false,
  number: false,
  boolean: false,
  enum: false,
  geopoint: false,
  "string[]": true,
  "number[]": true,
  "boolean[]": true,
  "enum[]": true
};
var INNER_TYPE = {
  "string[]": "string",
  "number[]": "number",
  "boolean[]": "boolean",
  "enum[]": "enum"
};
function isGeoPointType(type) {
  return type === "geopoint";
}
function isVectorType(type) {
  return typeof type === "string" && /^vector\[\d+\]$/.test(type);
}
function isArrayType(type) {
  return typeof type === "string" && IS_ARRAY_TYPE[type];
}
function getInnerType(type) {
  return INNER_TYPE[type];
}
function getVectorSize(type) {
  const size = Number(type.slice(7, -1));
  switch (true) {
    case isNaN(size):
      throw createError("INVALID_VECTOR_VALUE", type);
    case size <= 0:
      throw createError("INVALID_VECTOR_SIZE", type);
    default:
      return size;
  }
}

// node_modules/@orama/orama/dist/components/internal-document-id-store.js
function createInternalDocumentIDStore() {
  return {
    idToInternalId: /* @__PURE__ */ new Map(),
    internalIdToId: [],
    save,
    load
  };
}
function save(store2) {
  return {
    internalIdToId: store2.internalIdToId
  };
}
function load(orama, raw) {
  const { internalIdToId } = raw;
  orama.internalDocumentIDStore.idToInternalId.clear();
  orama.internalDocumentIDStore.internalIdToId = [];
  const internalIdToIdLength = internalIdToId.length;
  for (let i = 0; i < internalIdToIdLength; i++) {
    const internalIdItem = internalIdToId[i];
    orama.internalDocumentIDStore.idToInternalId.set(internalIdItem, i + 1);
    orama.internalDocumentIDStore.internalIdToId.push(internalIdItem);
  }
}
function getInternalDocumentId(store2, id) {
  if (typeof id === "string") {
    const internalId = store2.idToInternalId.get(id);
    if (internalId) {
      return internalId;
    }
    const currentId = store2.idToInternalId.size + 1;
    store2.idToInternalId.set(id, currentId);
    store2.internalIdToId.push(id);
    return currentId;
  }
  if (id > store2.internalIdToId.length) {
    return getInternalDocumentId(store2, id.toString());
  }
  return id;
}

// node_modules/@orama/orama/dist/components/documents-store.js
async function create(_, sharedInternalDocumentStore) {
  return {
    sharedInternalDocumentStore,
    docs: {},
    count: 0
  };
}
async function get(store2, id) {
  const internalId = getInternalDocumentId(store2.sharedInternalDocumentStore, id);
  return store2.docs[internalId];
}
async function getMultiple(store2, ids) {
  const idsLength = ids.length;
  const found = Array.from({
    length: idsLength
  });
  for (let i = 0; i < idsLength; i++) {
    const internalId = getInternalDocumentId(store2.sharedInternalDocumentStore, ids[i]);
    found[i] = store2.docs[internalId];
  }
  return found;
}
async function getAll(store2) {
  return store2.docs;
}
async function store(store2, id, doc) {
  const internalId = getInternalDocumentId(store2.sharedInternalDocumentStore, id);
  if (typeof store2.docs[internalId] !== "undefined") {
    return false;
  }
  store2.docs[internalId] = doc;
  store2.count++;
  return true;
}
async function remove(store2, id) {
  const internalId = getInternalDocumentId(store2.sharedInternalDocumentStore, id);
  if (typeof store2.docs[internalId] === "undefined") {
    return false;
  }
  delete store2.docs[internalId];
  store2.count--;
  return true;
}
async function count(store2) {
  return store2.count;
}
async function load2(sharedInternalDocumentStore, raw) {
  const rawDocument = raw;
  return {
    docs: rawDocument.docs,
    count: rawDocument.count,
    sharedInternalDocumentStore
  };
}
async function save2(store2) {
  return {
    docs: store2.docs,
    count: store2.count
  };
}
async function createDocumentsStore() {
  return {
    create,
    get,
    getMultiple,
    getAll,
    store,
    remove,
    count,
    load: load2,
    save: save2
  };
}

// node_modules/@orama/orama/dist/components/plugins.js
var AVAILABLE_PLUGIN_HOOKS = [
  "beforeInsert",
  "afterInsert",
  "beforeRemove",
  "afterRemove",
  "beforeUpdate",
  "afterUpdate",
  "beforeSearch",
  "afterSearch",
  "beforeInsertMultiple",
  "afterInsertMultiple",
  "beforeRemoveMultiple",
  "afterRemoveMultiple",
  "beforeUpdateMultiple",
  "afterUpdateMultiple",
  "beforeLoad",
  "afterLoad",
  "afterCreate"
];
async function getAllPluginsByHook(orama, hook) {
  var _orama_plugins;
  const pluginsToRun = [];
  const pluginsLength = (_orama_plugins = orama.plugins) === null || _orama_plugins === void 0 ? void 0 : _orama_plugins.length;
  if (!pluginsLength) {
    return pluginsToRun;
  }
  for (let i = 0; i < pluginsLength; i++) {
    try {
      const plugin2 = await orama.plugins[i];
      if (typeof plugin2[hook] === "function") {
        pluginsToRun.push(plugin2[hook]);
      }
    } catch (error) {
      console.error("Caught error in getAllPluginsByHook:", error);
      throw createError("PLUGIN_CRASHED");
    }
  }
  return pluginsToRun;
}

// node_modules/@orama/orama/dist/components/hooks.js
var OBJECT_COMPONENTS = [
  "tokenizer",
  "index",
  "documentsStore",
  "sorter"
];
var FUNCTION_COMPONENTS = [
  "validateSchema",
  "getDocumentIndexId",
  "getDocumentProperties",
  "formatElapsedTime"
];
async function runSingleHook(hooks, orama, id, doc) {
  const hooksLength = hooks.length;
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](orama, id, doc);
  }
}
async function runAfterCreate(hooks, db) {
  const hooksLength = hooks.length;
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](db);
  }
}

// node_modules/@orama/orama/dist/trees/avl.js
function rotateLeft(node) {
  const right = node.r;
  node.r = right.l;
  right.l = node;
  node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1;
  right.h = Math.max(getHeight(right.l), getHeight(right.r)) + 1;
  return right;
}
function rotateRight(node) {
  const left = node.l;
  node.l = left.r;
  left.r = node;
  node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1;
  left.h = Math.max(getHeight(left.l), getHeight(left.r)) + 1;
  return left;
}
function rangeSearch(node, min, max) {
  const result = [];
  function traverse(node2) {
    if (node2 === null) {
      return;
    }
    if (min < node2.k) {
      traverse(node2.l);
    }
    if (node2.k >= min && node2.k <= max) {
      safeArrayPush(result, node2.v);
    }
    if (max > node2.k) {
      traverse(node2.r);
    }
  }
  traverse(node.root);
  return result;
}
function greaterThan(node, key, inclusive = false) {
  const result = [];
  if (node === null)
    return result;
  const stack = [
    node.root
  ];
  while (stack.length > 0) {
    const node2 = stack.pop();
    if (!node2) {
      continue;
    }
    if (inclusive && node2.k >= key) {
      safeArrayPush(result, node2.v);
    }
    if (!inclusive && node2.k > key) {
      safeArrayPush(result, node2.v);
    }
    stack.push(node2.r);
    stack.push(node2.l);
  }
  return result;
}
function lessThan(node, key, inclusive = false) {
  const result = [];
  if (node === null)
    return result;
  const stack = [
    node.root
  ];
  while (stack.length > 0) {
    const node2 = stack.pop();
    if (!node2) {
      continue;
    }
    if (inclusive && node2.k <= key) {
      safeArrayPush(result, node2.v);
    }
    if (!inclusive && node2.k < key) {
      safeArrayPush(result, node2.v);
    }
    stack.push(node2.r);
    stack.push(node2.l);
  }
  return result;
}
function getNodeByKey(node, key) {
  while (node !== null) {
    if (key < node.k) {
      node = node.l;
    } else if (key > node.k) {
      node = node.r;
    } else {
      return node;
    }
  }
  return null;
}
function create2(key, value) {
  return {
    root: {
      k: key,
      v: value,
      l: null,
      r: null,
      h: 0
    }
  };
}
function insert(rootNode, key, newValue) {
  function insertNode(node, key2, newValue2) {
    if (node === null) {
      return {
        k: key2,
        v: newValue2,
        l: null,
        r: null,
        h: 0
      };
    }
    if (key2 < node.k) {
      node.l = insertNode(node.l, key2, newValue2);
    } else if (key2 > node.k) {
      node.r = insertNode(node.r, key2, newValue2);
    } else {
      for (const value of newValue2) {
        node.v.push(value);
      }
      return node;
    }
    node.h = 1 + Math.max(getHeight(node.l), getHeight(node.r));
    const balanceFactor = getHeight(node.l) - getHeight(node.r);
    if (balanceFactor > 1 && key2 < node.l.k) {
      return rotateRight(node);
    }
    if (balanceFactor < -1 && key2 > node.r.k) {
      return rotateLeft(node);
    }
    if (balanceFactor > 1 && key2 > node.l.k) {
      node.l = rotateLeft(node.l);
      return rotateRight(node);
    }
    if (balanceFactor < -1 && key2 < node.r.k) {
      node.r = rotateRight(node.r);
      return rotateLeft(node);
    }
    return node;
  }
  rootNode.root = insertNode(rootNode.root, key, newValue);
}
function getHeight(node) {
  return node !== null ? node.h : -1;
}
function find(root, key) {
  const node = getNodeByKey(root.root, key);
  if (node === null) {
    return null;
  }
  return node.v;
}
function remove2(rootNode, key) {
  if (rootNode === null || rootNode.root === null) {
    return;
  }
  let node = rootNode.root;
  let parentNode = null;
  while (node != null && node.k !== key) {
    parentNode = node;
    if (key < node.k) {
      node = node.l;
    } else {
      node = node.r;
    }
  }
  if (node === null) {
    return;
  }
  const deleteNode = () => {
    if (node.l === null && node.r === null) {
      if (parentNode === null) {
        rootNode.root = null;
      } else {
        if (parentNode.l === node) {
          parentNode.l = null;
        } else {
          parentNode.r = null;
        }
      }
    } else if (node.l != null && node.r != null) {
      let minValueNode = node.r;
      let minValueParent = node;
      while (minValueNode.l != null) {
        minValueParent = minValueNode;
        minValueNode = minValueNode.l;
      }
      node.k = minValueNode.k;
      if (minValueParent === node) {
        minValueParent.r = minValueNode.r;
      } else {
        minValueParent.l = minValueNode.r;
      }
    } else {
      const childNode = node.l != null ? node.l : node.r;
      if (parentNode === null) {
        rootNode.root = childNode;
      } else {
        if (parentNode.l === node) {
          parentNode.l = childNode;
        } else {
          parentNode.r = childNode;
        }
      }
    }
  };
  deleteNode();
}
function removeDocument(root, id, key) {
  const node = getNodeByKey(root.root, key);
  if (!node) {
    return;
  }
  if (node.v.length === 1) {
    remove2(root, key);
    return;
  }
  node.v.splice(node.v.indexOf(id), 1);
}

// node_modules/@orama/orama/dist/trees/flat.js
function create3() {
  return {
    numberToDocumentId: /* @__PURE__ */ new Map()
  };
}
function insert2(root, key, value) {
  if (root.numberToDocumentId.has(key)) {
    root.numberToDocumentId.get(key).push(value);
    return root;
  }
  root.numberToDocumentId.set(key, [
    value
  ]);
  return root;
}
function removeDocument2(root, id, key) {
  var _root_numberToDocumentId_get, _root_numberToDocumentId_get1;
  root === null || root === void 0 ? void 0 : root.numberToDocumentId.set(key, ((_root_numberToDocumentId_get = root === null || root === void 0 ? void 0 : root.numberToDocumentId.get(key)) === null || _root_numberToDocumentId_get === void 0 ? void 0 : _root_numberToDocumentId_get.filter((v2) => v2 !== id)) ?? []);
  if (((_root_numberToDocumentId_get1 = root === null || root === void 0 ? void 0 : root.numberToDocumentId.get(key)) === null || _root_numberToDocumentId_get1 === void 0 ? void 0 : _root_numberToDocumentId_get1.length) === 0) {
    root === null || root === void 0 ? void 0 : root.numberToDocumentId.delete(key);
  }
}
function filter(root, operation) {
  const operationKeys = Object.keys(operation);
  if (operationKeys.length !== 1) {
    throw new Error("Invalid operation");
  }
  const operationType = operationKeys[0];
  switch (operationType) {
    case "eq": {
      const value = operation[operationType];
      return root.numberToDocumentId.get(value) ?? [];
    }
    case "in": {
      const value = operation[operationType];
      const result = [];
      for (const v2 of value) {
        const ids = root.numberToDocumentId.get(v2);
        if (ids != null) {
          safeArrayPush(result, ids);
        }
      }
      return result;
    }
    case "nin": {
      const value = operation[operationType];
      const result = [];
      const keys = root.numberToDocumentId.keys();
      for (const key of keys) {
        if (value.includes(key)) {
          continue;
        }
        const ids = root.numberToDocumentId.get(key);
        if (ids != null) {
          safeArrayPush(result, ids);
        }
      }
      return result;
    }
  }
  throw new Error("Invalid operation");
}
function filterArr(root, operation) {
  const operationKeys = Object.keys(operation);
  if (operationKeys.length !== 1) {
    throw new Error("Invalid operation");
  }
  const operationType = operationKeys[0];
  switch (operationType) {
    case "containsAll": {
      const values = operation[operationType];
      const ids = values.map((value) => root.numberToDocumentId.get(value) ?? []);
      return intersect(ids);
    }
  }
  throw new Error("Invalid operation");
}

// node_modules/@orama/orama/dist/components/levenshtein.js
function _boundedLevenshtein(a, b, tolerance) {
  if (a === b) {
    return 0;
  }
  const swap = a;
  if (a.length > b.length) {
    a = b;
    b = swap;
  }
  let lenA = a.length;
  let lenB = b.length;
  let startIdx = 0;
  while (startIdx < lenA && a.charCodeAt(startIdx) === b.charCodeAt(startIdx)) {
    startIdx++;
  }
  if (startIdx === lenA) {
    return 0;
  }
  while (lenA > 0 && a.charCodeAt(~-lenA) === b.charCodeAt(~-lenB)) {
    lenA--;
    lenB--;
  }
  if (!lenA) {
    return lenB > tolerance ? -1 : lenB;
  }
  lenA -= startIdx;
  lenB -= startIdx;
  if (lenA <= tolerance && lenB <= tolerance) {
    return lenA > lenB ? lenA : lenB;
  }
  const delta = lenB - lenA;
  if (tolerance > lenB) {
    tolerance = lenB;
  } else if (delta > tolerance) {
    return -1;
  }
  let i = 0;
  const row = [];
  const characterCodeCache = [];
  while (i < tolerance) {
    characterCodeCache[i] = b.charCodeAt(startIdx + i);
    row[i] = ++i;
  }
  while (i < lenB) {
    characterCodeCache[i] = b.charCodeAt(startIdx + i);
    row[i++] = tolerance + 1;
  }
  const offset = tolerance - delta;
  const haveMax = tolerance < lenB;
  let jStart = 0;
  let jEnd = tolerance;
  let current = 0;
  let left = 0;
  let above = 0;
  let charA = 0;
  let j = 0;
  for (i = 0; i < lenA; i++) {
    left = i;
    current = i + 1;
    charA = a.charCodeAt(startIdx + i);
    jStart += i > offset ? 1 : 0;
    jEnd += jEnd < lenB ? 1 : 0;
    for (j = jStart; j < jEnd; j++) {
      above = current;
      current = left;
      left = row[j];
      if (charA !== characterCodeCache[j]) {
        if (left < current) {
          current = left;
        }
        if (above < current) {
          current = above;
        }
        current++;
      }
      row[j] = current;
    }
    if (haveMax && row[i + delta] > tolerance) {
      return -1;
    }
  }
  return current <= tolerance ? current : -1;
}
function syncBoundedLevenshtein(a, b, tolerance) {
  const distance = _boundedLevenshtein(a, b, tolerance);
  return {
    distance,
    isBounded: distance >= 0
  };
}

// node_modules/@orama/orama/dist/trees/radix.js
var Node = class {
  constructor(key, subWord, end) {
    this.k = key;
    this.s = subWord;
    this.e = end;
  }
  // Node children
  c = {};
  // Node documents
  d = [];
  // Node word
  w = "";
  toJSON() {
    return {
      w: this.w,
      s: this.s,
      c: this.c,
      d: this.d,
      e: this.e
    };
  }
};
function updateParent(node, parent) {
  node.w = parent.w + node.s;
}
function addDocument(node, docID) {
  node.d.push(docID);
}
function removeDocument3(node, docID) {
  const index = node.d.indexOf(docID);
  if (index === -1) {
    return false;
  }
  node.d.splice(index, 1);
  return true;
}
function findAllWords(node, output, term, exact, tolerance) {
  if (node.e) {
    const { w, d: docIDs } = node;
    if (exact && w !== term) {
      return {};
    }
    if (getOwnProperty(output, w) == null) {
      if (tolerance) {
        const difference = Math.abs(term.length - w.length);
        if (difference <= tolerance && syncBoundedLevenshtein(term, w, tolerance).isBounded) {
          output[w] = [];
        }
      } else {
        output[w] = [];
      }
    }
    if (getOwnProperty(output, w) != null && docIDs.length > 0) {
      const docs = new Set(output[w]);
      const docIDsLength = docIDs.length;
      for (let i = 0; i < docIDsLength; i++) {
        docs.add(docIDs[i]);
      }
      output[w] = Array.from(docs);
    }
  }
  for (const character of Object.keys(node.c)) {
    findAllWords(node.c[character], output, term, exact, tolerance);
  }
  return output;
}
function getCommonPrefix(a, b) {
  let commonPrefix = "";
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      return commonPrefix;
    }
    commonPrefix += a[i];
  }
  return commonPrefix;
}
function create4(end = false, subWord = "", key = "") {
  return new Node(key, subWord, end);
}
function insert3(root, word, docId) {
  const wordLength = word.length;
  for (let i = 0; i < wordLength; i++) {
    const currentCharacter = word[i];
    const wordAtIndex = word.substring(i);
    const rootChildCurrentChar = root.c[currentCharacter];
    if (rootChildCurrentChar) {
      const edgeLabel = rootChildCurrentChar.s;
      const edgeLabelLength = edgeLabel.length;
      const commonPrefix = getCommonPrefix(edgeLabel, wordAtIndex);
      const commonPrefixLength = commonPrefix.length;
      if (edgeLabel === wordAtIndex) {
        addDocument(rootChildCurrentChar, docId);
        rootChildCurrentChar.e = true;
        return;
      }
      const edgeLabelAtCommonPrefix = edgeLabel[commonPrefixLength];
      if (commonPrefixLength < edgeLabelLength && commonPrefixLength === wordAtIndex.length) {
        const newNode = create4(true, wordAtIndex, currentCharacter);
        newNode.c[edgeLabelAtCommonPrefix] = rootChildCurrentChar;
        const newNodeChild = newNode.c[edgeLabelAtCommonPrefix];
        newNodeChild.s = edgeLabel.substring(commonPrefixLength);
        newNodeChild.k = edgeLabelAtCommonPrefix;
        root.c[currentCharacter] = newNode;
        updateParent(newNode, root);
        updateParent(newNodeChild, newNode);
        addDocument(newNode, docId);
        return;
      }
      if (commonPrefixLength < edgeLabelLength && commonPrefixLength < wordAtIndex.length) {
        const inbetweenNode = create4(false, commonPrefix, currentCharacter);
        inbetweenNode.c[edgeLabelAtCommonPrefix] = rootChildCurrentChar;
        root.c[currentCharacter] = inbetweenNode;
        const inbetweenNodeChild = inbetweenNode.c[edgeLabelAtCommonPrefix];
        inbetweenNodeChild.s = edgeLabel.substring(commonPrefixLength);
        inbetweenNodeChild.k = edgeLabelAtCommonPrefix;
        const wordAtCommonPrefix = wordAtIndex[commonPrefixLength];
        const newNode = create4(true, word.substring(i + commonPrefixLength), wordAtCommonPrefix);
        addDocument(newNode, docId);
        inbetweenNode.c[wordAtCommonPrefix] = newNode;
        updateParent(inbetweenNode, root);
        updateParent(newNode, inbetweenNode);
        updateParent(inbetweenNodeChild, inbetweenNode);
        return;
      }
      i += edgeLabelLength - 1;
      root = rootChildCurrentChar;
    } else {
      const newNode = create4(true, wordAtIndex, currentCharacter);
      addDocument(newNode, docId);
      root.c[currentCharacter] = newNode;
      updateParent(newNode, root);
      return;
    }
  }
}
function _findLevenshtein(node, term, index, tolerance, originalTolerance, output) {
  if (tolerance < 0) {
    return;
  }
  if (node.w.startsWith(term)) {
    findAllWords(node, output, term, false, 0);
    return;
  }
  if (node.e) {
    const { w, d: docIDs } = node;
    if (w) {
      if (syncBoundedLevenshtein(term, w, originalTolerance).isBounded) {
        output[w] = [];
      }
      if (getOwnProperty(output, w) != null && docIDs.length > 0) {
        const docs = new Set(output[w]);
        const docIDsLength = docIDs.length;
        for (let i = 0; i < docIDsLength; i++) {
          docs.add(docIDs[i]);
        }
        output[w] = Array.from(docs);
      }
    }
  }
  if (index >= term.length) {
    return;
  }
  if (term[index] in node.c) {
    _findLevenshtein(node.c[term[index]], term, index + 1, tolerance, originalTolerance, output);
  }
  _findLevenshtein(node, term, index + 1, tolerance - 1, originalTolerance, output);
  for (const character in node.c) {
    _findLevenshtein(node.c[character], term, index, tolerance - 1, originalTolerance, output);
  }
  for (const character in node.c) {
    if (character !== term[index]) {
      _findLevenshtein(node.c[character], term, index + 1, tolerance - 1, originalTolerance, output);
    }
  }
}
function find2(root, { term, exact, tolerance }) {
  if (tolerance && !exact) {
    const output = {};
    tolerance = tolerance || 0;
    _findLevenshtein(root, term, 0, tolerance || 0, tolerance, output);
    return output;
  } else {
    const termLength = term.length;
    for (let i = 0; i < termLength; i++) {
      const character = term[i];
      if (character in root.c) {
        const rootChildCurrentChar = root.c[character];
        const edgeLabel = rootChildCurrentChar.s;
        const termSubstring = term.substring(i);
        const commonPrefix = getCommonPrefix(edgeLabel, termSubstring);
        const commonPrefixLength = commonPrefix.length;
        if (commonPrefixLength !== edgeLabel.length && commonPrefixLength !== termSubstring.length) {
          if (tolerance)
            break;
          return {};
        }
        i += rootChildCurrentChar.s.length - 1;
        root = rootChildCurrentChar;
      } else {
        return {};
      }
    }
    const output = {};
    findAllWords(root, output, term, exact, tolerance);
    return output;
  }
}
function removeDocumentByWord(root, term, docID, exact = true) {
  if (!term) {
    return true;
  }
  const termLength = term.length;
  for (let i = 0; i < termLength; i++) {
    const character = term[i];
    if (character in root.c) {
      const rootChildCurrentChar = root.c[character];
      i += rootChildCurrentChar.s.length - 1;
      root = rootChildCurrentChar;
      if (exact && root.w !== term) {
      } else {
        removeDocument3(root, docID);
      }
    } else {
      return false;
    }
  }
  return true;
}

// node_modules/@orama/orama/dist/trees/bkd.js
var K = 2;
var EARTH_RADIUS = 6371e3;
function create5() {
  return {
    root: null
  };
}
function insert4(tree, point, docIDs) {
  const newNode = {
    point,
    docIDs
  };
  if (tree.root == null) {
    tree.root = newNode;
    return;
  }
  let node = tree.root;
  let depth = 0;
  while (node !== null) {
    if (node.point.lon === point.lon && node.point.lat === point.lat) {
      const newDocIDs = node.docIDs ?? [];
      node.docIDs = Array.from(/* @__PURE__ */ new Set([
        ...newDocIDs,
        ...docIDs || []
      ]));
      return;
    }
    const axis = depth % K;
    if (axis === 0) {
      if (point.lon < node.point.lon) {
        if (node.left == null) {
          node.left = newNode;
          return;
        }
        node = node.left;
      } else {
        if (node.right == null) {
          node.right = newNode;
          return;
        }
        node = node.right;
      }
    } else {
      if (point.lat < node.point.lat) {
        if (node.left == null) {
          node.left = newNode;
          return;
        }
        node = node.left;
      } else {
        if (node.right == null) {
          node.right = newNode;
          return;
        }
        node = node.right;
      }
    }
    depth++;
  }
}
function removeDocByID(tree, point, docID) {
  let node = tree.root;
  let depth = 0;
  let parentNode = null;
  let direction = null;
  while (node !== null) {
    if ((node === null || node === void 0 ? void 0 : node.point.lon) === point.lon && node.point.lat === point.lat) {
      var _node_docIDs;
      const index = (_node_docIDs = node.docIDs) === null || _node_docIDs === void 0 ? void 0 : _node_docIDs.indexOf(docID);
      if (index !== void 0 && index > -1) {
        var _node_docIDs1;
        (_node_docIDs1 = node.docIDs) === null || _node_docIDs1 === void 0 ? void 0 : _node_docIDs1.splice(index, 1);
        if (node.docIDs == null || node.docIDs.length === 0) {
          if (parentNode != null) {
            if (direction === "left") {
              parentNode.left = node.left !== null ? node.left : node.right;
            } else if (direction === "right") {
              parentNode.right = node.right !== null ? node.right : node.left;
            }
          } else {
            tree.root = node.left !== null ? node.left : node.right;
          }
        }
        return;
      }
    }
    const axis = depth % K;
    parentNode = node;
    if (axis === 0) {
      if (point.lon < node.point.lon) {
        node = node === null || node === void 0 ? void 0 : node.left;
        direction = "left";
      } else {
        node = node === null || node === void 0 ? void 0 : node.right;
        direction = "right";
      }
    } else {
      if (point.lat < node.point.lat) {
        node = node === null || node === void 0 ? void 0 : node.left;
        direction = "left";
      } else {
        node = node === null || node === void 0 ? void 0 : node.right;
        direction = "right";
      }
    }
    depth++;
  }
}
function searchByRadius(node, center, radius, inclusive = true, sort = "asc", highPrecision = false) {
  const distanceFn = highPrecision ? vincentyDistance : haversineDistance;
  const stack = [
    {
      node,
      depth: 0
    }
  ];
  const result = [];
  while (stack.length > 0) {
    const { node: node2, depth } = stack.pop();
    if (node2 === null)
      continue;
    const dist = distanceFn(center, node2.point);
    if (inclusive ? dist <= radius : dist > radius) {
      result.push({
        point: node2.point,
        docIDs: node2.docIDs ?? []
      });
    }
    if (node2.left != null) {
      stack.push({
        node: node2.left,
        depth: depth + 1
      });
    }
    if (node2.right != null) {
      stack.push({
        node: node2.right,
        depth: depth + 1
      });
    }
  }
  if (sort) {
    result.sort((a, b) => {
      const distA = distanceFn(center, a.point);
      const distB = distanceFn(center, b.point);
      return sort.toLowerCase() === "asc" ? distA - distB : distB - distA;
    });
  }
  return result;
}
function searchByPolygon(root, polygon, inclusive = true, sort = null, highPrecision = false) {
  const stack = [
    {
      node: root,
      depth: 0
    }
  ];
  const result = [];
  while (stack.length > 0) {
    const task = stack.pop();
    if (task == null || task.node == null)
      continue;
    const { node, depth } = task;
    const nextDepth = depth + 1;
    if (node.left != null) {
      stack.push({
        node: node.left,
        depth: nextDepth
      });
    }
    if (node.right != null) {
      stack.push({
        node: node.right,
        depth: nextDepth
      });
    }
    const isInsidePolygon = isPointInPolygon(polygon, node.point);
    if (isInsidePolygon && inclusive) {
      result.push({
        point: node.point,
        docIDs: node.docIDs ?? []
      });
    } else if (!isInsidePolygon && !inclusive) {
      result.push({
        point: node.point,
        docIDs: node.docIDs ?? []
      });
    }
  }
  const centroid = calculatePolygonCentroid(polygon);
  if (sort) {
    const sortFn = highPrecision ? vincentyDistance : haversineDistance;
    result.sort((a, b) => {
      const distA = sortFn(centroid, a.point);
      const distB = sortFn(centroid, b.point);
      return sort.toLowerCase() === "asc" ? distA - distB : distB - distA;
    });
  }
  return result;
}
function calculatePolygonCentroid(polygon) {
  let totalArea = 0;
  let centroidX = 0;
  let centroidY = 0;
  const polygonLength = polygon.length;
  for (let i = 0, j = polygonLength - 1; i < polygonLength; j = i++) {
    const xi = polygon[i].lon;
    const yi = polygon[i].lat;
    const xj = polygon[j].lon;
    const yj = polygon[j].lat;
    const areaSegment = xi * yj - xj * yi;
    totalArea += areaSegment;
    centroidX += (xi + xj) * areaSegment;
    centroidY += (yi + yj) * areaSegment;
  }
  totalArea /= 2;
  const centroidCoordinate = 6 * totalArea;
  centroidX /= centroidCoordinate;
  centroidY /= centroidCoordinate;
  return {
    lon: centroidX,
    lat: centroidY
  };
}
function isPointInPolygon(polygon, point) {
  let isInside = false;
  const x = point.lon;
  const y = point.lat;
  const polygonLength = polygon.length;
  for (let i = 0, j = polygonLength - 1; i < polygonLength; j = i++) {
    const xi = polygon[i].lon;
    const yi = polygon[i].lat;
    const xj = polygon[j].lon;
    const yj = polygon[j].lat;
    const intersect2 = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect2)
      isInside = !isInside;
  }
  return isInside;
}
function haversineDistance(coord1, coord2) {
  const P = Math.PI / 180;
  const lat1 = coord1.lat * P;
  const lat2 = coord2.lat * P;
  const deltaLat = (coord2.lat - coord1.lat) * P;
  const deltaLon = (coord2.lon - coord1.lon) * P;
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c2 = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c2;
}
function vincentyDistance(coord1, coord2) {
  const a = 6378137;
  const f = 1 / 298.257223563;
  const b = (1 - f) * a;
  const P = Math.PI / 180;
  const lat1 = coord1.lat * P;
  const lat2 = coord2.lat * P;
  const deltaLon = (coord2.lon - coord1.lon) * P;
  const U1 = Math.atan((1 - f) * Math.tan(lat1));
  const U2 = Math.atan((1 - f) * Math.tan(lat2));
  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2);
  const cosU2 = Math.cos(U2);
  let lambda = deltaLon;
  let prevLambda;
  let iterationLimit = 1e3;
  let sinAlpha;
  let cos2Alpha;
  let sinSigma;
  let cosSigma;
  let sigma;
  do {
    const sinLambda = Math.sin(lambda);
    const cosLambda = Math.cos(lambda);
    sinSigma = Math.sqrt(cosU2 * sinLambda * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
    cos2Alpha = 1 - sinAlpha * sinAlpha;
    const cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cos2Alpha;
    const C2 = f / 16 * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha));
    prevLambda = lambda;
    lambda = deltaLon + (1 - C2) * f * sinAlpha * (sigma + C2 * sinSigma * (cos2SigmaM + C2 * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  } while (Math.abs(lambda - prevLambda) > 1e-12 && --iterationLimit > 0);
  const u2 = cos2Alpha * (a * a - b * b) / (b * b);
  const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const deltaSigma = B * sinSigma * (cosSigma - 2 * sinU1 * sinU2 / cos2Alpha + B / 4 * (cosSigma * (-1 + 2 * sinSigma * sinSigma) - B / 6 * sigma * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * sigma * sigma)));
  const s = b * A * (sigma - deltaSigma);
  return s;
}

// node_modules/@orama/orama/dist/components/algorithms.js
function BM25(tf, matchingCount, docsCount, fieldLength, averageFieldLength, { k, b, d }) {
  const idf = Math.log(1 + (docsCount - matchingCount + 0.5) / (matchingCount + 0.5));
  return idf * (d + tf * (k + 1)) / (tf + k * (1 - b + b * fieldLength / averageFieldLength));
}

// node_modules/@orama/orama/dist/components/cosine-similarity.js
function getMagnitude(vector, vectorLength) {
  let magnitude = 0;
  for (let i = 0; i < vectorLength; i++) {
    magnitude += vector[i] * vector[i];
  }
  return Math.sqrt(magnitude);
}

// node_modules/@orama/orama/dist/components/index.js
async function insertDocumentScoreParameters(index, prop, id, tokens, docsCount) {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id);
  index.avgFieldLength[prop] = ((index.avgFieldLength[prop] ?? 0) * (docsCount - 1) + tokens.length) / docsCount;
  index.fieldLengths[prop][internalId] = tokens.length;
  index.frequencies[prop][internalId] = {};
}
async function insertTokenScoreParameters(index, prop, id, tokens, token) {
  let tokenFrequency = 0;
  for (const t of tokens) {
    if (t === token) {
      tokenFrequency++;
    }
  }
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id);
  const tf = tokenFrequency / tokens.length;
  index.frequencies[prop][internalId][token] = tf;
  if (!(token in index.tokenOccurrences[prop])) {
    index.tokenOccurrences[prop][token] = 0;
  }
  index.tokenOccurrences[prop][token] = (index.tokenOccurrences[prop][token] ?? 0) + 1;
}
async function removeDocumentScoreParameters(index, prop, id, docsCount) {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id);
  index.avgFieldLength[prop] = (index.avgFieldLength[prop] * docsCount - index.fieldLengths[prop][internalId]) / (docsCount - 1);
  index.fieldLengths[prop][internalId] = void 0;
  index.frequencies[prop][internalId] = void 0;
}
async function removeTokenScoreParameters(index, prop, token) {
  index.tokenOccurrences[prop][token]--;
}
async function calculateResultScores(context, index, prop, term, ids) {
  const documentIDs = Array.from(ids);
  const avgFieldLength = index.avgFieldLength[prop];
  const fieldLengths = index.fieldLengths[prop];
  const oramaOccurrences = index.tokenOccurrences[prop];
  const oramaFrequencies = index.frequencies[prop];
  const termOccurrences = typeof oramaOccurrences[term] === "number" ? oramaOccurrences[term] ?? 0 : 0;
  const scoreList = [];
  const documentIDsLength = documentIDs.length;
  for (let k = 0; k < documentIDsLength; k++) {
    var _oramaFrequencies_internalId;
    const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, documentIDs[k]);
    const tf = (oramaFrequencies === null || oramaFrequencies === void 0 ? void 0 : (_oramaFrequencies_internalId = oramaFrequencies[internalId]) === null || _oramaFrequencies_internalId === void 0 ? void 0 : _oramaFrequencies_internalId[term]) ?? 0;
    const bm25 = BM25(tf, termOccurrences, context.docsCount, fieldLengths[internalId], avgFieldLength, context.params.relevance);
    scoreList.push([
      internalId,
      bm25
    ]);
  }
  return scoreList;
}
async function create6(orama, sharedInternalDocumentStore, schema, index, prefix = "") {
  if (!index) {
    index = {
      sharedInternalDocumentStore,
      indexes: {},
      vectorIndexes: {},
      searchableProperties: [],
      searchablePropertiesWithTypes: {},
      frequencies: {},
      tokenOccurrences: {},
      avgFieldLength: {},
      fieldLengths: {}
    };
  }
  for (const [prop, type] of Object.entries(schema)) {
    const path = `${prefix}${prefix ? "." : ""}${prop}`;
    if (typeof type === "object" && !Array.isArray(type)) {
      create6(orama, sharedInternalDocumentStore, type, index, path);
      continue;
    }
    if (isVectorType(type)) {
      index.searchableProperties.push(path);
      index.searchablePropertiesWithTypes[path] = type;
      index.vectorIndexes[path] = {
        size: getVectorSize(type),
        vectors: {}
      };
    } else {
      const isArray = /\[/.test(type);
      switch (type) {
        case "boolean":
        case "boolean[]":
          index.indexes[path] = {
            type: "Bool",
            node: {
              true: [],
              false: []
            },
            isArray
          };
          break;
        case "number":
        case "number[]":
          index.indexes[path] = {
            type: "AVL",
            node: create2(0, []),
            isArray
          };
          break;
        case "string":
        case "string[]":
          index.indexes[path] = {
            type: "Radix",
            node: create4(),
            isArray
          };
          index.avgFieldLength[path] = 0;
          index.frequencies[path] = {};
          index.tokenOccurrences[path] = {};
          index.fieldLengths[path] = {};
          break;
        case "enum":
        case "enum[]":
          index.indexes[path] = {
            type: "Flat",
            node: create3(),
            isArray
          };
          break;
        case "geopoint":
          index.indexes[path] = {
            type: "BKD",
            node: create5(),
            isArray
          };
          break;
        default:
          throw createError("INVALID_SCHEMA_TYPE", Array.isArray(type) ? "array" : type, path);
      }
      index.searchableProperties.push(path);
      index.searchablePropertiesWithTypes[path] = type;
    }
  }
  return index;
}
function insertScalarBuilder(implementation, index, prop, id, language, tokenizer, docsCount) {
  return async (value) => {
    const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id);
    const { type, node } = index.indexes[prop];
    switch (type) {
      case "Bool": {
        node[value ? "true" : "false"].push(internalId);
        break;
      }
      case "AVL": {
        insert(node, value, [
          internalId
        ]);
        break;
      }
      case "Radix": {
        const tokens = await tokenizer.tokenize(value, language, prop);
        await implementation.insertDocumentScoreParameters(index, prop, internalId, tokens, docsCount);
        for (const token of tokens) {
          await implementation.insertTokenScoreParameters(index, prop, internalId, tokens, token);
          insert3(node, token, internalId);
        }
        break;
      }
      case "Flat": {
        insert2(node, value, internalId);
        break;
      }
      case "BKD": {
        insert4(node, value, [
          internalId
        ]);
        break;
      }
    }
  };
}
async function insert5(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount) {
  if (isVectorType(schemaType)) {
    return insertVector(index, prop, value, id);
  }
  const insertScalar = insertScalarBuilder(implementation, index, prop, id, language, tokenizer, docsCount);
  if (!isArrayType(schemaType)) {
    return insertScalar(value);
  }
  const elements = value;
  const elementsLength = elements.length;
  for (let i = 0; i < elementsLength; i++) {
    await insertScalar(elements[i]);
  }
}
function insertVector(index, prop, value, id) {
  if (!(value instanceof Float32Array)) {
    value = new Float32Array(value);
  }
  const size = index.vectorIndexes[prop].size;
  const magnitude = getMagnitude(value, size);
  index.vectorIndexes[prop].vectors[id] = [
    magnitude,
    value
  ];
}
async function removeScalar(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount) {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id);
  if (isVectorType(schemaType)) {
    delete index.vectorIndexes[prop].vectors[id];
    return true;
  }
  const { type, node } = index.indexes[prop];
  switch (type) {
    case "AVL": {
      removeDocument(node, internalId, value);
      return true;
    }
    case "Bool": {
      const booleanKey = value ? "true" : "false";
      const position = node[booleanKey].indexOf(internalId);
      node[value ? "true" : "false"].splice(position, 1);
      return true;
    }
    case "Radix": {
      const tokens = await tokenizer.tokenize(value, language, prop);
      await implementation.removeDocumentScoreParameters(index, prop, id, docsCount);
      for (const token of tokens) {
        await implementation.removeTokenScoreParameters(index, prop, token);
        removeDocumentByWord(node, token, internalId);
      }
      return true;
    }
    case "Flat": {
      removeDocument2(node, internalId, value);
      return true;
    }
    case "BKD": {
      removeDocByID(node, value, internalId);
      return false;
    }
  }
}
async function remove3(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount) {
  if (!isArrayType(schemaType)) {
    return removeScalar(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount);
  }
  const innerSchemaType = getInnerType(schemaType);
  const elements = value;
  const elementsLength = elements.length;
  for (let i = 0; i < elementsLength; i++) {
    await removeScalar(implementation, index, prop, id, elements[i], innerSchemaType, language, tokenizer, docsCount);
  }
  return true;
}
async function search(context, index, prop, term) {
  if (!(prop in index.tokenOccurrences)) {
    return [];
  }
  const { node, type } = index.indexes[prop];
  if (type !== "Radix") {
    throw createError("WRONG_SEARCH_PROPERTY_TYPE", prop);
  }
  const { exact, tolerance } = context.params;
  const searchResult = find2(node, {
    term,
    exact,
    tolerance
  });
  const ids = /* @__PURE__ */ new Set();
  for (const key in searchResult) {
    const ownProperty = getOwnProperty(searchResult, key);
    if (!ownProperty)
      continue;
    for (const id of searchResult[key]) {
      ids.add(id);
    }
  }
  return context.index.calculateResultScores(context, index, prop, term, Array.from(ids));
}
async function searchByWhereClause(context, index, filters) {
  const filterKeys = Object.keys(filters);
  const filtersMap = filterKeys.reduce((acc, key) => ({
    [key]: [],
    ...acc
  }), {});
  for (const param of filterKeys) {
    const operation = filters[param];
    if (typeof index.indexes[param] === "undefined") {
      throw createError("UNKNOWN_FILTER_PROPERTY", param);
    }
    const { node, type, isArray } = index.indexes[param];
    if (type === "Bool") {
      const idx = node;
      const filteredIDs = idx[operation.toString()];
      safeArrayPush(filtersMap[param], filteredIDs);
      continue;
    }
    if (type === "BKD") {
      let reqOperation;
      if ("radius" in operation) {
        reqOperation = "radius";
      } else if ("polygon" in operation) {
        reqOperation = "polygon";
      } else {
        throw new Error(`Invalid operation ${operation}`);
      }
      if (reqOperation === "radius") {
        const { value, coordinates, unit = "m", inside = true, highPrecision = false } = operation[reqOperation];
        const distanceInMeters = convertDistanceToMeters(value, unit);
        const ids = searchByRadius(node.root, coordinates, distanceInMeters, inside, void 0, highPrecision);
        safeArrayPush(filtersMap[param], ids.map(({ docIDs }) => docIDs).flat());
      } else {
        const { coordinates, inside = true, highPrecision = false } = operation[reqOperation];
        const ids = searchByPolygon(node.root, coordinates, inside, void 0, highPrecision);
        safeArrayPush(filtersMap[param], ids.map(({ docIDs }) => docIDs).flat());
      }
      continue;
    }
    if (type === "Radix" && (typeof operation === "string" || Array.isArray(operation))) {
      for (const raw of [
        operation
      ].flat()) {
        const term = await context.tokenizer.tokenize(raw, context.language, param);
        for (const t of term) {
          const filteredIDsResults = find2(node, {
            term: t,
            exact: true
          });
          safeArrayPush(filtersMap[param], Object.values(filteredIDsResults).flat());
        }
      }
      continue;
    }
    const operationKeys = Object.keys(operation);
    if (operationKeys.length > 1) {
      throw createError("INVALID_FILTER_OPERATION", operationKeys.length);
    }
    if (type === "Flat") {
      if (isArray) {
        safeArrayPush(filtersMap[param], filterArr(node, operation));
      } else {
        safeArrayPush(filtersMap[param], filter(node, operation));
      }
      continue;
    }
    if (type === "AVL") {
      const operationOpt = operationKeys[0];
      const operationValue = operation[operationOpt];
      let filteredIDs = [];
      switch (operationOpt) {
        case "gt": {
          filteredIDs = greaterThan(node, operationValue, false);
          break;
        }
        case "gte": {
          filteredIDs = greaterThan(node, operationValue, true);
          break;
        }
        case "lt": {
          filteredIDs = lessThan(node, operationValue, false);
          break;
        }
        case "lte": {
          filteredIDs = lessThan(node, operationValue, true);
          break;
        }
        case "eq": {
          filteredIDs = find(node, operationValue) ?? [];
          break;
        }
        case "between": {
          const [min, max] = operationValue;
          filteredIDs = rangeSearch(node, min, max);
          break;
        }
      }
      safeArrayPush(filtersMap[param], filteredIDs);
    }
  }
  const result = intersect(Object.values(filtersMap));
  return result;
}
async function getSearchableProperties(index) {
  return index.searchableProperties;
}
async function getSearchablePropertiesWithTypes(index) {
  return index.searchablePropertiesWithTypes;
}
function loadRadixNode(node) {
  const convertedNode = create4(node.e, node.s, node.k);
  convertedNode.d = node.d;
  convertedNode.w = node.w;
  for (const childrenKey of Object.keys(node.c)) {
    convertedNode.c[childrenKey] = loadRadixNode(node.c[childrenKey]);
  }
  return convertedNode;
}
function loadFlatNode(node) {
  return {
    numberToDocumentId: new Map(node)
  };
}
function saveFlatNode(node) {
  return Array.from(node.numberToDocumentId.entries());
}
async function load3(sharedInternalDocumentStore, raw) {
  const { indexes: rawIndexes, vectorIndexes: rawVectorIndexes, searchableProperties, searchablePropertiesWithTypes, frequencies, tokenOccurrences, avgFieldLength, fieldLengths } = raw;
  const indexes = {};
  const vectorIndexes = {};
  for (const prop of Object.keys(rawIndexes)) {
    const { node, type, isArray } = rawIndexes[prop];
    switch (type) {
      case "Radix":
        indexes[prop] = {
          type: "Radix",
          node: loadRadixNode(node),
          isArray
        };
        break;
      case "Flat":
        indexes[prop] = {
          type: "Flat",
          node: loadFlatNode(node),
          isArray
        };
        break;
      default:
        indexes[prop] = rawIndexes[prop];
    }
  }
  for (const idx of Object.keys(rawVectorIndexes)) {
    const vectors = rawVectorIndexes[idx].vectors;
    for (const vec in vectors) {
      vectors[vec] = [
        vectors[vec][0],
        new Float32Array(vectors[vec][1])
      ];
    }
    vectorIndexes[idx] = {
      size: rawVectorIndexes[idx].size,
      vectors
    };
  }
  return {
    sharedInternalDocumentStore,
    indexes,
    vectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths
  };
}
async function save3(index) {
  const { indexes, vectorIndexes, searchableProperties, searchablePropertiesWithTypes, frequencies, tokenOccurrences, avgFieldLength, fieldLengths } = index;
  const vectorIndexesAsArrays = {};
  for (const idx of Object.keys(vectorIndexes)) {
    const vectors = vectorIndexes[idx].vectors;
    for (const vec in vectors) {
      vectors[vec] = [
        vectors[vec][0],
        Array.from(vectors[vec][1])
      ];
    }
    vectorIndexesAsArrays[idx] = {
      size: vectorIndexes[idx].size,
      vectors
    };
  }
  const savedIndexes = {};
  for (const name of Object.keys(indexes)) {
    const { type, node, isArray } = indexes[name];
    if (type !== "Flat") {
      savedIndexes[name] = indexes[name];
      continue;
    }
    savedIndexes[name] = {
      type: "Flat",
      node: saveFlatNode(node),
      isArray
    };
  }
  return {
    indexes: savedIndexes,
    vectorIndexes: vectorIndexesAsArrays,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths
  };
}
async function createIndex() {
  return {
    create: create6,
    insert: insert5,
    remove: remove3,
    insertDocumentScoreParameters,
    insertTokenScoreParameters,
    removeDocumentScoreParameters,
    removeTokenScoreParameters,
    calculateResultScores,
    search,
    searchByWhereClause,
    getSearchableProperties,
    getSearchablePropertiesWithTypes,
    load: load3,
    save: save3
  };
}

// node_modules/@orama/orama/dist/components/sorter.js
function innerCreate(orama, sharedInternalDocumentStore, schema, sortableDeniedProperties, prefix) {
  const sorter = {
    language: orama.tokenizer.language,
    sharedInternalDocumentStore,
    enabled: true,
    isSorted: true,
    sortableProperties: [],
    sortablePropertiesWithTypes: {},
    sorts: {}
  };
  for (const [prop, type] of Object.entries(schema)) {
    const path = `${prefix}${prefix ? "." : ""}${prop}`;
    if (sortableDeniedProperties.includes(path)) {
      continue;
    }
    if (typeof type === "object" && !Array.isArray(type)) {
      const ret = innerCreate(orama, sharedInternalDocumentStore, type, sortableDeniedProperties, path);
      safeArrayPush(sorter.sortableProperties, ret.sortableProperties);
      sorter.sorts = {
        ...sorter.sorts,
        ...ret.sorts
      };
      sorter.sortablePropertiesWithTypes = {
        ...sorter.sortablePropertiesWithTypes,
        ...ret.sortablePropertiesWithTypes
      };
      continue;
    }
    if (!isVectorType(type)) {
      switch (type) {
        case "boolean":
        case "number":
        case "string":
          sorter.sortableProperties.push(path);
          sorter.sortablePropertiesWithTypes[path] = type;
          sorter.sorts[path] = {
            docs: /* @__PURE__ */ new Map(),
            orderedDocsToRemove: /* @__PURE__ */ new Map(),
            orderedDocs: [],
            type
          };
          break;
        case "geopoint":
        case "enum":
          continue;
        case "enum[]":
        case "boolean[]":
        case "number[]":
        case "string[]":
          continue;
        default:
          throw createError("INVALID_SORT_SCHEMA_TYPE", Array.isArray(type) ? "array" : type, path);
      }
    }
  }
  return sorter;
}
async function create7(orama, sharedInternalDocumentStore, schema, config) {
  const isSortEnabled = (config === null || config === void 0 ? void 0 : config.enabled) !== false;
  if (!isSortEnabled) {
    return {
      disabled: true
    };
  }
  return innerCreate(orama, sharedInternalDocumentStore, schema, (config || {}).unsortableProperties || [], "");
}
async function insert6(sorter, prop, id, value) {
  if (!sorter.enabled) {
    return;
  }
  sorter.isSorted = false;
  const internalId = getInternalDocumentId(sorter.sharedInternalDocumentStore, id);
  const s = sorter.sorts[prop];
  if (s.orderedDocsToRemove.has(internalId)) {
    ensureOrderedDocsAreDeletedByProperty(sorter, prop);
  }
  s.docs.set(internalId, s.orderedDocs.length);
  s.orderedDocs.push([
    internalId,
    value
  ]);
}
function ensureIsSorted(sorter) {
  if (sorter.isSorted || !sorter.enabled) {
    return;
  }
  const properties = Object.keys(sorter.sorts);
  for (const prop of properties) {
    ensurePropertyIsSorted(sorter, prop);
  }
  sorter.isSorted = true;
}
function stringSort(language, value, d) {
  return value[1].localeCompare(d[1], getLocale(language));
}
function numberSort(value, d) {
  return value[1] - d[1];
}
function booleanSort(value, d) {
  return d[1] ? -1 : 1;
}
function ensurePropertyIsSorted(sorter, prop) {
  const s = sorter.sorts[prop];
  let predicate;
  switch (s.type) {
    case "string":
      predicate = stringSort.bind(null, sorter.language);
      break;
    case "number":
      predicate = numberSort.bind(null);
      break;
    case "boolean":
      predicate = booleanSort.bind(null);
      break;
  }
  s.orderedDocs.sort(predicate);
  const orderedDocsLength = s.orderedDocs.length;
  for (let i = 0; i < orderedDocsLength; i++) {
    const docId = s.orderedDocs[i][0];
    s.docs.set(docId, i);
  }
}
function ensureOrderedDocsAreDeleted(sorter) {
  const properties = Object.keys(sorter.sorts);
  for (const prop of properties) {
    ensureOrderedDocsAreDeletedByProperty(sorter, prop);
  }
}
function ensureOrderedDocsAreDeletedByProperty(sorter, prop) {
  const s = sorter.sorts[prop];
  if (!s.orderedDocsToRemove.size)
    return;
  s.orderedDocs = s.orderedDocs.filter((doc) => !s.orderedDocsToRemove.has(doc[0]));
  s.orderedDocsToRemove.clear();
}
async function remove4(sorter, prop, id) {
  if (!sorter.enabled) {
    return;
  }
  const s = sorter.sorts[prop];
  const internalId = getInternalDocumentId(sorter.sharedInternalDocumentStore, id);
  const index = s.docs.get(internalId);
  if (!index)
    return;
  s.docs.delete(internalId);
  s.orderedDocsToRemove.set(internalId, true);
}
async function sortBy(sorter, docIds, by) {
  if (!sorter.enabled) {
    throw createError("SORT_DISABLED");
  }
  const property = by.property;
  const isDesc = by.order === "DESC";
  const s = sorter.sorts[property];
  if (!s) {
    throw createError("UNABLE_TO_SORT_ON_UNKNOWN_FIELD", property, sorter.sortableProperties.join(", "));
  }
  ensureOrderedDocsAreDeletedByProperty(sorter, property);
  ensureIsSorted(sorter);
  docIds.sort((a, b) => {
    const indexOfA = s.docs.get(getInternalDocumentId(sorter.sharedInternalDocumentStore, a[0]));
    const indexOfB = s.docs.get(getInternalDocumentId(sorter.sharedInternalDocumentStore, b[0]));
    const isAIndexed = typeof indexOfA !== "undefined";
    const isBIndexed = typeof indexOfB !== "undefined";
    if (!isAIndexed && !isBIndexed) {
      return 0;
    }
    if (!isAIndexed) {
      return 1;
    }
    if (!isBIndexed) {
      return -1;
    }
    return isDesc ? indexOfB - indexOfA : indexOfA - indexOfB;
  });
  return docIds;
}
async function getSortableProperties(sorter) {
  if (!sorter.enabled) {
    return [];
  }
  return sorter.sortableProperties;
}
async function getSortablePropertiesWithTypes(sorter) {
  if (!sorter.enabled) {
    return {};
  }
  return sorter.sortablePropertiesWithTypes;
}
async function load4(sharedInternalDocumentStore, raw) {
  const rawDocument = raw;
  if (!rawDocument.enabled) {
    return {
      enabled: false
    };
  }
  const sorts = Object.keys(rawDocument.sorts).reduce((acc, prop) => {
    const { docs, orderedDocs, type } = rawDocument.sorts[prop];
    acc[prop] = {
      docs: new Map(Object.entries(docs).map(([k, v2]) => [
        +k,
        v2
      ])),
      orderedDocsToRemove: /* @__PURE__ */ new Map(),
      orderedDocs,
      type
    };
    return acc;
  }, {});
  return {
    sharedInternalDocumentStore,
    language: rawDocument.language,
    sortableProperties: rawDocument.sortableProperties,
    sortablePropertiesWithTypes: rawDocument.sortablePropertiesWithTypes,
    sorts,
    enabled: true,
    isSorted: rawDocument.isSorted
  };
}
async function save4(sorter) {
  if (!sorter.enabled) {
    return {
      enabled: false
    };
  }
  ensureOrderedDocsAreDeleted(sorter);
  ensureIsSorted(sorter);
  const sorts = Object.keys(sorter.sorts).reduce((acc, prop) => {
    const { docs, orderedDocs, type } = sorter.sorts[prop];
    acc[prop] = {
      docs: Object.fromEntries(docs.entries()),
      orderedDocs,
      type
    };
    return acc;
  }, {});
  return {
    language: sorter.language,
    sortableProperties: sorter.sortableProperties,
    sortablePropertiesWithTypes: sorter.sortablePropertiesWithTypes,
    sorts,
    enabled: sorter.enabled,
    isSorted: sorter.isSorted
  };
}
async function createSorter() {
  return {
    create: create7,
    insert: insert6,
    remove: remove4,
    save: save4,
    load: load4,
    sortBy,
    getSortableProperties,
    getSortablePropertiesWithTypes
  };
}

// node_modules/@orama/orama/dist/components/tokenizer/diacritics.js
var DIACRITICS_CHARCODE_START = 192;
var DIACRITICS_CHARCODE_END = 383;
var CHARCODE_REPLACE_MAPPING = [
  65,
  65,
  65,
  65,
  65,
  65,
  65,
  67,
  69,
  69,
  69,
  69,
  73,
  73,
  73,
  73,
  69,
  78,
  79,
  79,
  79,
  79,
  79,
  null,
  79,
  85,
  85,
  85,
  85,
  89,
  80,
  115,
  97,
  97,
  97,
  97,
  97,
  97,
  97,
  99,
  101,
  101,
  101,
  101,
  105,
  105,
  105,
  105,
  101,
  110,
  111,
  111,
  111,
  111,
  111,
  null,
  111,
  117,
  117,
  117,
  117,
  121,
  112,
  121,
  65,
  97,
  65,
  97,
  65,
  97,
  67,
  99,
  67,
  99,
  67,
  99,
  67,
  99,
  68,
  100,
  68,
  100,
  69,
  101,
  69,
  101,
  69,
  101,
  69,
  101,
  69,
  101,
  71,
  103,
  71,
  103,
  71,
  103,
  71,
  103,
  72,
  104,
  72,
  104,
  73,
  105,
  73,
  105,
  73,
  105,
  73,
  105,
  73,
  105,
  73,
  105,
  74,
  106,
  75,
  107,
  107,
  76,
  108,
  76,
  108,
  76,
  108,
  76,
  108,
  76,
  108,
  78,
  110,
  78,
  110,
  78,
  110,
  110,
  78,
  110,
  79,
  111,
  79,
  111,
  79,
  111,
  79,
  111,
  82,
  114,
  82,
  114,
  82,
  114,
  83,
  115,
  83,
  115,
  83,
  115,
  83,
  115,
  84,
  116,
  84,
  116,
  84,
  116,
  85,
  117,
  85,
  117,
  85,
  117,
  85,
  117,
  85,
  117,
  85,
  117,
  87,
  119,
  89,
  121,
  89,
  90,
  122,
  90,
  122,
  90,
  122,
  115
];
function replaceChar(charCode) {
  if (charCode < DIACRITICS_CHARCODE_START || charCode > DIACRITICS_CHARCODE_END)
    return charCode;
  return CHARCODE_REPLACE_MAPPING[charCode - DIACRITICS_CHARCODE_START] || charCode;
}
function replaceDiacritics(str) {
  const stringCharCode = [];
  for (let idx = 0; idx < str.length; idx++) {
    stringCharCode[idx] = replaceChar(str.charCodeAt(idx));
  }
  return String.fromCharCode(...stringCharCode);
}

// node_modules/@orama/orama/dist/components/tokenizer/english-stemmer.js
var step2List = {
  ational: "ate",
  tional: "tion",
  enci: "ence",
  anci: "ance",
  izer: "ize",
  bli: "ble",
  alli: "al",
  entli: "ent",
  eli: "e",
  ousli: "ous",
  ization: "ize",
  ation: "ate",
  ator: "ate",
  alism: "al",
  iveness: "ive",
  fulness: "ful",
  ousness: "ous",
  aliti: "al",
  iviti: "ive",
  biliti: "ble",
  logi: "log"
};
var step3List = {
  icate: "ic",
  ative: "",
  alize: "al",
  iciti: "ic",
  ical: "ic",
  ful: "",
  ness: ""
};
var c = "[^aeiou]";
var v = "[aeiouy]";
var C = c + "[^aeiouy]*";
var V = v + "[aeiou]*";
var mgr0 = "^(" + C + ")?" + V + C;
var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$";
var mgr1 = "^(" + C + ")?" + V + C + V + C;
var s_v = "^(" + C + ")?" + v;
function stemmer(w) {
  let stem;
  let suffix;
  let re;
  let re2;
  let re3;
  let re4;
  if (w.length < 3) {
    return w;
  }
  const firstch = w.substring(0, 1);
  if (firstch == "y") {
    w = firstch.toUpperCase() + w.substring(1);
  }
  re = /^(.+?)(ss|i)es$/;
  re2 = /^(.+?)([^s])s$/;
  if (re.test(w)) {
    w = w.replace(re, "$1$2");
  } else if (re2.test(w)) {
    w = w.replace(re2, "$1$2");
  }
  re = /^(.+?)eed$/;
  re2 = /^(.+?)(ed|ing)$/;
  if (re.test(w)) {
    const fp = re.exec(w);
    re = new RegExp(mgr0);
    if (re.test(fp[1])) {
      re = /.$/;
      w = w.replace(re, "");
    }
  } else if (re2.test(w)) {
    const fp = re2.exec(w);
    stem = fp[1];
    re2 = new RegExp(s_v);
    if (re2.test(stem)) {
      w = stem;
      re2 = /(at|bl|iz)$/;
      re3 = new RegExp("([^aeiouylsz])\\1$");
      re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re2.test(w)) {
        w = w + "e";
      } else if (re3.test(w)) {
        re = /.$/;
        w = w.replace(re, "");
      } else if (re4.test(w)) {
        w = w + "e";
      }
    }
  }
  re = /^(.+?)y$/;
  if (re.test(w)) {
    const fp = re.exec(w);
    stem = fp === null || fp === void 0 ? void 0 : fp[1];
    re = new RegExp(s_v);
    if (stem && re.test(stem)) {
      w = stem + "i";
    }
  }
  re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
  if (re.test(w)) {
    const fp = re.exec(w);
    stem = fp === null || fp === void 0 ? void 0 : fp[1];
    suffix = fp === null || fp === void 0 ? void 0 : fp[2];
    re = new RegExp(mgr0);
    if (stem && re.test(stem)) {
      w = stem + step2List[suffix];
    }
  }
  re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
  if (re.test(w)) {
    const fp = re.exec(w);
    stem = fp === null || fp === void 0 ? void 0 : fp[1];
    suffix = fp === null || fp === void 0 ? void 0 : fp[2];
    re = new RegExp(mgr0);
    if (stem && re.test(stem)) {
      w = stem + step3List[suffix];
    }
  }
  re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  re2 = /^(.+?)(s|t)(ion)$/;
  if (re.test(w)) {
    const fp = re.exec(w);
    stem = fp === null || fp === void 0 ? void 0 : fp[1];
    re = new RegExp(mgr1);
    if (stem && re.test(stem)) {
      w = stem;
    }
  } else if (re2.test(w)) {
    const fp = re2.exec(w);
    stem = (fp === null || fp === void 0 ? void 0 : fp[1]) ?? "" + (fp === null || fp === void 0 ? void 0 : fp[2]) ?? "";
    re2 = new RegExp(mgr1);
    if (re2.test(stem)) {
      w = stem;
    }
  }
  re = /^(.+?)e$/;
  if (re.test(w)) {
    const fp = re.exec(w);
    stem = fp === null || fp === void 0 ? void 0 : fp[1];
    re = new RegExp(mgr1);
    re2 = new RegExp(meq1);
    re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
    if (stem && (re.test(stem) || re2.test(stem) && !re3.test(stem))) {
      w = stem;
    }
  }
  re = /ll$/;
  re2 = new RegExp(mgr1);
  if (re.test(w) && re2.test(w)) {
    re = /.$/;
    w = w.replace(re, "");
  }
  if (firstch == "y") {
    w = firstch.toLowerCase() + w.substring(1);
  }
  return w;
}

// node_modules/@orama/orama/dist/components/tokenizer/index.js
function normalizeToken(prop, token) {
  var _this_stopWords;
  const key = `${this.language}:${prop}:${token}`;
  if (this.normalizationCache.has(key)) {
    return this.normalizationCache.get(key);
  }
  if ((_this_stopWords = this.stopWords) === null || _this_stopWords === void 0 ? void 0 : _this_stopWords.includes(token)) {
    this.normalizationCache.set(key, "");
    return "";
  }
  if (this.stemmer && !this.stemmerSkipProperties.has(prop)) {
    token = this.stemmer(token);
  }
  token = replaceDiacritics(token);
  this.normalizationCache.set(key, token);
  return token;
}
function trim(text) {
  while (text[text.length - 1] === "") {
    text.pop();
  }
  while (text[0] === "") {
    text.shift();
  }
  return text;
}
function tokenize(input, language, prop) {
  if (language && language !== this.language) {
    throw createError("LANGUAGE_NOT_SUPPORTED", language);
  }
  if (typeof input !== "string") {
    return [
      input
    ];
  }
  let tokens;
  if (prop && this.tokenizeSkipProperties.has(prop)) {
    tokens = [
      this.normalizeToken.bind(this, prop ?? "")(input)
    ];
  } else {
    const splitRule = SPLITTERS[this.language];
    tokens = input.toLowerCase().split(splitRule).map(this.normalizeToken.bind(this, prop ?? "")).filter(Boolean);
  }
  const trimTokens = trim(tokens);
  if (!this.allowDuplicates) {
    return Array.from(new Set(trimTokens));
  }
  return trimTokens;
}
async function createTokenizer(config = {}) {
  if (!config.language) {
    config.language = "english";
  } else if (!SUPPORTED_LANGUAGES.includes(config.language)) {
    throw createError("LANGUAGE_NOT_SUPPORTED", config.language);
  }
  let stemmer2;
  if (config.stemming || config.stemmer && !("stemming" in config)) {
    if (config.stemmer) {
      if (typeof config.stemmer !== "function") {
        throw createError("INVALID_STEMMER_FUNCTION_TYPE");
      }
      stemmer2 = config.stemmer;
    } else {
      if (config.language === "english") {
        stemmer2 = stemmer;
      } else {
        throw createError("MISSING_STEMMER", config.language);
      }
    }
  }
  let stopWords;
  if (config.stopWords !== false) {
    stopWords = [];
    if (Array.isArray(config.stopWords)) {
      stopWords = config.stopWords;
    } else if (typeof config.stopWords === "function") {
      stopWords = await config.stopWords(stopWords);
    } else if (config.stopWords) {
      throw createError("CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY");
    }
    if (!Array.isArray(stopWords)) {
      throw createError("CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY");
    }
    for (const s of stopWords) {
      if (typeof s !== "string") {
        throw createError("CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY");
      }
    }
  }
  const tokenizer = {
    tokenize,
    language: config.language,
    stemmer: stemmer2,
    stemmerSkipProperties: new Set(config.stemmerSkipProperties ? [
      config.stemmerSkipProperties
    ].flat() : []),
    tokenizeSkipProperties: new Set(config.tokenizeSkipProperties ? [
      config.tokenizeSkipProperties
    ].flat() : []),
    stopWords,
    allowDuplicates: Boolean(config.allowDuplicates),
    normalizeToken,
    normalizationCache: /* @__PURE__ */ new Map()
  };
  tokenizer.tokenize = tokenize.bind(tokenizer);
  tokenizer.normalizeToken = normalizeToken;
  return tokenizer;
}

// node_modules/@orama/orama/dist/methods/create.js
function validateComponents(components) {
  const defaultComponents = {
    formatElapsedTime,
    getDocumentIndexId,
    getDocumentProperties,
    validateSchema
  };
  for (const rawKey of FUNCTION_COMPONENTS) {
    const key = rawKey;
    if (components[key]) {
      if (typeof components[key] !== "function") {
        throw createError("COMPONENT_MUST_BE_FUNCTION", key);
      }
    } else {
      components[key] = defaultComponents[key];
    }
  }
  for (const rawKey of Object.keys(components)) {
    if (!OBJECT_COMPONENTS.includes(rawKey) && !FUNCTION_COMPONENTS.includes(rawKey)) {
      throw createError("UNSUPPORTED_COMPONENT", rawKey);
    }
  }
}
async function create8({ schema, sort, language, components, id, plugins }) {
  if (!components) {
    components = {};
  }
  if (!id) {
    id = await uniqueId();
  }
  let tokenizer = components.tokenizer;
  let index = components.index;
  let documentsStore = components.documentsStore;
  let sorter = components.sorter;
  if (!tokenizer) {
    tokenizer = await createTokenizer({
      language: language ?? "english"
    });
  } else if (!tokenizer.tokenize) {
    tokenizer = await createTokenizer(tokenizer);
  } else {
    const customTokenizer = tokenizer;
    tokenizer = customTokenizer;
  }
  if (components.tokenizer && language) {
    throw createError("NO_LANGUAGE_WITH_CUSTOM_TOKENIZER");
  }
  const internalDocumentStore = createInternalDocumentIDStore();
  index ||= await createIndex();
  sorter ||= await createSorter();
  documentsStore ||= await createDocumentsStore();
  validateComponents(components);
  const { getDocumentProperties: getDocumentProperties2, getDocumentIndexId: getDocumentIndexId2, validateSchema: validateSchema2, formatElapsedTime: formatElapsedTime2 } = components;
  const orama = {
    data: {},
    caches: {},
    schema,
    tokenizer,
    index,
    sorter,
    documentsStore,
    internalDocumentIDStore: internalDocumentStore,
    getDocumentProperties: getDocumentProperties2,
    getDocumentIndexId: getDocumentIndexId2,
    validateSchema: validateSchema2,
    beforeInsert: [],
    afterInsert: [],
    beforeRemove: [],
    afterRemove: [],
    beforeUpdate: [],
    afterUpdate: [],
    beforeSearch: [],
    afterSearch: [],
    beforeInsertMultiple: [],
    afterInsertMultiple: [],
    beforeRemoveMultiple: [],
    afterRemoveMultiple: [],
    afterUpdateMultiple: [],
    beforeUpdateMultiple: [],
    afterCreate: [],
    formatElapsedTime: formatElapsedTime2,
    id,
    plugins,
    version: getVersion()
  };
  orama.data = {
    index: await orama.index.create(orama, internalDocumentStore, schema),
    docs: await orama.documentsStore.create(orama, internalDocumentStore),
    sorting: await orama.sorter.create(orama, internalDocumentStore, schema, sort)
  };
  for (const hook of AVAILABLE_PLUGIN_HOOKS) {
    orama[hook] = (orama[hook] ?? []).concat(await getAllPluginsByHook(orama, hook));
  }
  const afterCreate = orama["afterCreate"];
  if (afterCreate) {
    await runAfterCreate(afterCreate, orama);
  }
  return orama;
}
function getVersion() {
  return "2.0.18";
}

// node_modules/@orama/orama/dist/types.js
var kInsertions = Symbol("orama.insertions");
var kRemovals = Symbol("orama.removals");

// node_modules/@orama/orama/dist/components/sync-blocking-checker.js
var _globalThis_process;
var warn = ((_globalThis_process = globalThis.process) === null || _globalThis_process === void 0 ? void 0 : _globalThis_process.emitWarning) ?? function emitWarning(message, options) {
  console.warn(`[WARNING] [${options.code}] ${message}`);
};
function trackInsertion(orama) {
  if (typeof orama[kInsertions] !== "number") {
    queueMicrotask(() => {
      orama[kInsertions] = void 0;
    });
    orama[kInsertions] = 0;
  }
  if (orama[kInsertions] > 1e3) {
    warn("Orama's insert operation is synchronous. Please avoid inserting a large number of document in a single operation in order not to block the main thread or, in alternative, please use insertMultiple.", {
      code: "ORAMA0001"
    });
    orama[kInsertions] = -1;
  } else if (orama[kInsertions] >= 0) {
    orama[kInsertions]++;
  }
}

// node_modules/@orama/orama/dist/methods/insert.js
async function insert7(orama, doc, language, skipHooks) {
  const errorProperty = await orama.validateSchema(doc, orama.schema);
  if (errorProperty) {
    throw createError("SCHEMA_VALIDATION_FAILURE", errorProperty);
  }
  return innerInsert(orama, doc, language, skipHooks);
}
var ENUM_TYPE = /* @__PURE__ */ new Set([
  "enum",
  "enum[]"
]);
var STRING_NUMBER_TYPE = /* @__PURE__ */ new Set([
  "string",
  "number"
]);
async function innerInsert(orama, doc, language, skipHooks) {
  const { index, docs } = orama.data;
  const id = await orama.getDocumentIndexId(doc);
  if (typeof id !== "string") {
    throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof id);
  }
  if (!await orama.documentsStore.store(docs, id, doc)) {
    throw createError("DOCUMENT_ALREADY_EXISTS", id);
  }
  const docsCount = await orama.documentsStore.count(docs);
  if (!skipHooks) {
    await runSingleHook(orama.beforeInsert, orama, id, doc);
  }
  const indexableProperties = await orama.index.getSearchableProperties(index);
  const indexablePropertiesWithTypes = await orama.index.getSearchablePropertiesWithTypes(index);
  const indexableValues = await orama.getDocumentProperties(doc, indexableProperties);
  for (const [key, value] of Object.entries(indexableValues)) {
    if (typeof value === "undefined") {
      continue;
    }
    const actualType = typeof value;
    const expectedType = indexablePropertiesWithTypes[key];
    if (isGeoPointType(expectedType) && typeof value === "object" && typeof value.lon === "number" && typeof value.lat === "number") {
      continue;
    }
    if (isVectorType(expectedType) && Array.isArray(value)) {
      continue;
    }
    if (isArrayType(expectedType) && Array.isArray(value)) {
      continue;
    }
    if (ENUM_TYPE.has(expectedType) && STRING_NUMBER_TYPE.has(actualType)) {
      continue;
    }
    if (actualType !== expectedType) {
      throw createError("INVALID_DOCUMENT_PROPERTY", key, expectedType, actualType);
    }
  }
  for (const prop of indexableProperties) {
    var _orama_index, _orama_index_beforeInsert, _orama_index1, _orama_index_afterInsert;
    const value = indexableValues[prop];
    if (typeof value === "undefined") {
      continue;
    }
    const expectedType = indexablePropertiesWithTypes[prop];
    await ((_orama_index_beforeInsert = (_orama_index = orama.index).beforeInsert) === null || _orama_index_beforeInsert === void 0 ? void 0 : _orama_index_beforeInsert.call(_orama_index, orama.data.index, prop, id, value, expectedType, language, orama.tokenizer, docsCount));
    await orama.index.insert(orama.index, orama.data.index, prop, id, value, expectedType, language, orama.tokenizer, docsCount);
    await ((_orama_index_afterInsert = (_orama_index1 = orama.index).afterInsert) === null || _orama_index_afterInsert === void 0 ? void 0 : _orama_index_afterInsert.call(_orama_index1, orama.data.index, prop, id, value, expectedType, language, orama.tokenizer, docsCount));
  }
  const sortableProperties = await orama.sorter.getSortableProperties(orama.data.sorting);
  const sortablePropertiesWithTypes = await orama.sorter.getSortablePropertiesWithTypes(orama.data.sorting);
  const sortableValues = await orama.getDocumentProperties(doc, sortableProperties);
  for (const prop of sortableProperties) {
    const value = sortableValues[prop];
    if (typeof value === "undefined") {
      continue;
    }
    const expectedType = sortablePropertiesWithTypes[prop];
    await orama.sorter.insert(orama.data.sorting, prop, id, value, expectedType, language);
  }
  if (!skipHooks) {
    await runSingleHook(orama.afterInsert, orama, id, doc);
  }
  trackInsertion(orama);
  return id;
}

// src/nodes/imvb/CreateDatabaseNode.ts
var vdb = await create8({
  schema: {
    name: "string",
    body: "string",
    embedding: `vector[1024]`
  }
});

// src/nodes/imvb/AddVectorNode.ts
var addVectorPluginNode = (rivet) => {
  const impl = {
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          id: "",
          embedding: [],
          text: ""
        },
        title: "Add Vector Embedding",
        type: "addVector",
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useIdInput) {
        inputs.push({
          id: "id",
          dataType: "string",
          title: "ID",
          required: true
        });
      }
      if (data.useEmbeddingInput) {
        inputs.push({
          id: "embedding",
          dataType: "vector",
          title: "Embedding",
          required: true
        });
      }
      if (data.useTextInput) {
        inputs.push({
          id: "text",
          dataType: "string",
          title: "Text",
          required: true
        });
      }
      return inputs;
    },
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "id",
          dataType: "string",
          title: "ID"
        },
        {
          id: "score",
          dataType: "number",
          title: "Score"
        },
        {
          id: "embedding",
          dataType: "vector",
          title: "Embedding"
        }
      ];
    },
    getUIData(_context) {
      return {
        contextMenuTitle: "Add Vector",
        group: "Vector DB",
        infoBoxBody: "This is a node for adding text to the in-memory vector database.",
        infoBoxTitle: "Add Vector Node"
      };
    },
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "id",
          label: "ID",
          useInputToggleDataKey: "useIdInput"
        },
        {
          type: "anyData",
          dataKey: "embedding",
          label: "Embedding",
          useInputToggleDataKey: "useEmbeddingInput"
        }
      ];
    },
    getBody(data, _context) {
      return rivet.dedent`
        Add Vector Node
        ID: ${data.id}
        Vector: [${data.embedding}]
      `;
    },
    async process(data, inputData, _context) {
      const embedding = rivet.getInputOrData(
        data,
        inputData,
        "embedding",
        "vector",
        "useEmbeddingInput"
      );
      const id = rivet.getInputOrData(
        data,
        inputData,
        "id",
        "string",
        "useIdInput"
      );
      const text = rivet.getInputOrData(
        data,
        inputData,
        "text",
        "string",
        "useTextInput"
      );
      const added = await insert7(vdb, {
        name: id,
        body: text,
        embedding
      });
      return {
        ["id"]: {
          type: "string",
          value: added
        }
      };
    }
  };
  return rivet.pluginNodeDefinition(impl, "Add Vector");
};

// src/index.ts
var plugin = (rivet) => {
  const guidNode = guidPluginNode(rivet);
  const addVectorNode = addVectorPluginNode(rivet);
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
      register(addVectorNode);
    }
  };
  return tuesdayCrowdPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
