#!/usr/bin/env node
// Generated from packages/cli (github.com/doubleagent-so/doubleagent). Do not edit.
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e2) {
    throw err = [e2], e2;
  }
};

// ../../node_modules/abitype/dist/esm/version.js
var version;
var init_version = __esm({
  "../../node_modules/abitype/dist/esm/version.js"() {
    version = "1.2.3";
  }
});

// ../../node_modules/abitype/dist/esm/errors.js
var BaseError;
var init_errors = __esm({
  "../../node_modules/abitype/dist/esm/errors.js"() {
    init_version();
    BaseError = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
        const docsPath3 = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath3 ? [`Docs: https://abitype.dev${docsPath3}`] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: abitype@${version}`
        ].join("\n");
        super(message);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiTypeError"
        });
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath3;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
    };
  }
});

// ../../node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}
var bytesRegex, integerRegex, isTupleRegex;
var init_regex = __esm({
  "../../node_modules/abitype/dist/esm/regex.js"() {
    bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    isTupleRegex = /^\(.+?\).*?$/;
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
function formatAbiParameter(abiParameter) {
  let type = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
    type = "(";
    const length = abiParameter.components.length;
    for (let i2 = 0; i2 < length; i2++) {
      const component = abiParameter.components[i2];
      type += formatAbiParameter(component);
      if (i2 < length - 1)
        type += ", ";
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type += `)${result?.array || ""}`;
    return formatAbiParameter({
      ...abiParameter,
      type
    });
  }
  if ("indexed" in abiParameter && abiParameter.indexed)
    type = `${type} indexed`;
  if (abiParameter.name)
    return `${type} ${abiParameter.name}`;
  return type;
}
var tupleRegex;
var init_formatAbiParameter = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js"() {
    init_regex();
    tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
function formatAbiParameters(abiParameters) {
  let params = "";
  const length = abiParameters.length;
  for (let i2 = 0; i2 < length; i2++) {
    const abiParameter = abiParameters[i2];
    params += formatAbiParameter(abiParameter);
    if (i2 !== length - 1)
      params += ", ";
  }
  return params;
}
var init_formatAbiParameters = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js"() {
    init_formatAbiParameter();
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
function formatAbiItem(abiItem) {
  if (abiItem.type === "function")
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
  if (abiItem.type === "event")
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "error")
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "constructor")
    return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  if (abiItem.type === "fallback")
    return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  return "receive() external payable";
}
var init_formatAbiItem = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/formatAbiItem.js"() {
    init_formatAbiParameters();
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
function execFallbackSignature(signature) {
  return execTyped(fallbackSignatureRegex, signature);
}
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, eventModifiers, functionModifiers;
var init_signatures = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/runtime/signatures.js"() {
    init_regex();
    errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
    structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
    constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
    fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
    receiveSignatureRegex = /^receive\(\) external payable$/;
    eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
    functionModifiers = /* @__PURE__ */ new Set([
      "calldata",
      "memory",
      "storage"
    ]);
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var UnknownTypeError, UnknownSolidityTypeError;
var init_abiItem = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/errors/abiItem.js"() {
    init_errors();
    UnknownTypeError = class extends BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [
            `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownTypeError"
        });
      }
    };
    UnknownSolidityTypeError = class extends BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [`Type "${type}" is not a valid ABI type.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSolidityTypeError"
        });
      }
    };
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
var init_abiParameter = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js"() {
    init_errors();
    InvalidParameterError = class extends BaseError {
      constructor({ param }) {
        super("Invalid ABI parameter.", {
          details: param
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParameterError"
        });
      }
    };
    SolidityProtectedKeywordError = class extends BaseError {
      constructor({ param, name }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SolidityProtectedKeywordError"
        });
      }
    };
    InvalidModifierError = class extends BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidModifierError"
        });
      }
    };
    InvalidFunctionModifierError = class extends BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
            `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidFunctionModifierError"
        });
      }
    };
    InvalidAbiTypeParameterError = class extends BaseError {
      constructor({ abiParameter }) {
        super("Invalid ABI parameter.", {
          details: JSON.stringify(abiParameter, null, 2),
          metaMessages: ["ABI parameter type is invalid."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiTypeParameterError"
        });
      }
    };
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError, UnknownSignatureError, InvalidStructSignatureError;
var init_signature = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/errors/signature.js"() {
    init_errors();
    InvalidSignatureError = class extends BaseError {
      constructor({ signature, type }) {
        super(`Invalid ${type} signature.`, {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSignatureError"
        });
      }
    };
    UnknownSignatureError = class extends BaseError {
      constructor({ signature }) {
        super("Unknown signature.", {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSignatureError"
        });
      }
    };
    InvalidStructSignatureError = class extends BaseError {
      constructor({ signature }) {
        super("Invalid struct signature.", {
          details: signature,
          metaMessages: ["No properties exist."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidStructSignatureError"
        });
      }
    };
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError;
var init_struct = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/errors/struct.js"() {
    init_errors();
    CircularReferenceError = class extends BaseError {
      constructor({ type }) {
        super("Circular reference detected.", {
          metaMessages: [`Struct "${type}" is a circular reference.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "CircularReferenceError"
        });
      }
    };
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError;
var init_splitParameters = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js"() {
    init_errors();
    InvalidParenthesisError = class extends BaseError {
      constructor({ current, depth }) {
        super("Unbalanced parentheses.", {
          metaMessages: [
            `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
          ],
          details: `Depth "${depth}"`
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParenthesisError"
        });
      }
    };
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type, structs) {
  let structKey = "";
  if (structs)
    for (const struct of Object.entries(structs)) {
      if (!struct)
        continue;
      let propertyKey = "";
      for (const property of struct[1]) {
        propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
      }
      structKey += `(${struct[0]}{${propertyKey}})`;
    }
  if (type)
    return `${type}:${param}${structKey}`;
  return `${param}${structKey}`;
}
var parameterCache;
var init_cache = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/runtime/cache.js"() {
    parameterCache = /* @__PURE__ */ new Map([
      // Unnamed
      ["address", { type: "address" }],
      ["bool", { type: "bool" }],
      ["bytes", { type: "bytes" }],
      ["bytes32", { type: "bytes32" }],
      ["int", { type: "int256" }],
      ["int256", { type: "int256" }],
      ["string", { type: "string" }],
      ["uint", { type: "uint256" }],
      ["uint8", { type: "uint8" }],
      ["uint16", { type: "uint16" }],
      ["uint24", { type: "uint24" }],
      ["uint32", { type: "uint32" }],
      ["uint64", { type: "uint64" }],
      ["uint96", { type: "uint96" }],
      ["uint112", { type: "uint112" }],
      ["uint160", { type: "uint160" }],
      ["uint192", { type: "uint192" }],
      ["uint256", { type: "uint256" }],
      // Named
      ["address owner", { type: "address", name: "owner" }],
      ["address to", { type: "address", name: "to" }],
      ["bool approved", { type: "bool", name: "approved" }],
      ["bytes _data", { type: "bytes", name: "_data" }],
      ["bytes data", { type: "bytes", name: "data" }],
      ["bytes signature", { type: "bytes", name: "signature" }],
      ["bytes32 hash", { type: "bytes32", name: "hash" }],
      ["bytes32 r", { type: "bytes32", name: "r" }],
      ["bytes32 root", { type: "bytes32", name: "root" }],
      ["bytes32 s", { type: "bytes32", name: "s" }],
      ["string name", { type: "string", name: "name" }],
      ["string symbol", { type: "string", name: "symbol" }],
      ["string tokenURI", { type: "string", name: "tokenURI" }],
      ["uint tokenId", { type: "uint256", name: "tokenId" }],
      ["uint8 v", { type: "uint8", name: "v" }],
      ["uint256 balance", { type: "uint256", name: "balance" }],
      ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
      ["uint256 value", { type: "uint256", name: "value" }],
      // Indexed
      [
        "event:address indexed from",
        { type: "address", name: "from", indexed: true }
      ],
      ["event:address indexed to", { type: "address", name: "to", indexed: true }],
      [
        "event:uint indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ],
      [
        "event:uint256 indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ]
    ]);
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
  if (isFunctionSignature(signature))
    return parseFunctionSignature(signature, structs);
  if (isEventSignature(signature))
    return parseEventSignature(signature, structs);
  if (isErrorSignature(signature))
    return parseErrorSignature(signature, structs);
  if (isConstructorSignature(signature))
    return parseConstructorSignature(signature, structs);
  if (isFallbackSignature(signature))
    return parseFallbackSignature(signature);
  if (isReceiveSignature(signature))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature });
}
function parseFunctionSignature(signature, structs = {}) {
  const match = execFunctionSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "function" });
  const inputParams = splitParameters(match.parameters);
  const inputs = [];
  const inputLength = inputParams.length;
  for (let i2 = 0; i2 < inputLength; i2++) {
    inputs.push(parseAbiParameter(inputParams[i2], {
      modifiers: functionModifiers,
      structs,
      type: "function"
    }));
  }
  const outputs = [];
  if (match.returns) {
    const outputParams = splitParameters(match.returns);
    const outputLength = outputParams.length;
    for (let i2 = 0; i2 < outputLength; i2++) {
      outputs.push(parseAbiParameter(outputParams[i2], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
  }
  return {
    name: match.name,
    type: "function",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs,
    outputs
  };
}
function parseEventSignature(signature, structs = {}) {
  const match = execEventSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "event" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i2 = 0; i2 < length; i2++)
    abiParameters.push(parseAbiParameter(params[i2], {
      modifiers: eventModifiers,
      structs,
      type: "event"
    }));
  return { name: match.name, type: "event", inputs: abiParameters };
}
function parseErrorSignature(signature, structs = {}) {
  const match = execErrorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "error" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i2 = 0; i2 < length; i2++)
    abiParameters.push(parseAbiParameter(params[i2], { structs, type: "error" }));
  return { name: match.name, type: "error", inputs: abiParameters };
}
function parseConstructorSignature(signature, structs = {}) {
  const match = execConstructorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "constructor" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i2 = 0; i2 < length; i2++)
    abiParameters.push(parseAbiParameter(params[i2], { structs, type: "constructor" }));
  return {
    type: "constructor",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs: abiParameters
  };
}
function parseFallbackSignature(signature) {
  const match = execFallbackSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "fallback" });
  return {
    type: "fallback",
    stateMutability: match.stateMutability ?? "nonpayable"
  };
}
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters(match.type);
    const components_ = [];
    const length = params.length;
    for (let i2 = 0; i2 < length; i2++) {
      components_.push(parseAbiParameter(params[i2], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type = `${match.type}256`;
  } else if (match.type === "address payable") {
    type = "address";
  } else {
    type = match.type;
    if (!(options?.type === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match.modifier) {
    if (!options?.modifiers?.has?.(match.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
  }
  const abiParameter = {
    type: `${type}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i2 = 0; i2 < length; i2++) {
    const char = params[i2];
    const tail = params.slice(i2 + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}
var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
var init_utils = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/runtime/utils.js"() {
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_signature();
    init_splitParameters();
    init_cache();
    init_signatures();
    abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    dynamicIntegerRegex = /^u?int$/;
    protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i2 = 0; i2 < signaturesLength; i2++) {
    const signature = signatures[i2];
    if (!isStructSignature(signature))
      continue;
    const match = execStructSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i2 = 0; i2 < entriesLength; i2++) {
    const [name, parameters] = entries[i2];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
function resolveStructs(abiParameters = [], structs = {}, ancestors = /* @__PURE__ */ new Set()) {
  const components = [];
  const length = abiParameters.length;
  for (let i2 = 0; i2 < length; i2++) {
    const abiParameter = abiParameters[i2];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!match?.type)
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array, type } = match;
      if (type in structs) {
        if (ancestors.has(type))
          throw new CircularReferenceError({ type });
        components.push({
          ...abiParameter,
          type: `tuple${array ?? ""}`,
          components: resolveStructs(structs[type], structs, /* @__PURE__ */ new Set([...ancestors, type]))
        });
      } else {
        if (isSolidityType(type))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type });
      }
    }
  }
  return components;
}
var typeWithoutTupleRegex;
var init_structs = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/runtime/structs.js"() {
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_signature();
    init_struct();
    init_signatures();
    init_utils();
    typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
  }
});

// ../../node_modules/abitype/dist/esm/human-readable/parseAbi.js
function parseAbi(signatures) {
  const structs = parseStructs(signatures);
  const abi = [];
  const length = signatures.length;
  for (let i2 = 0; i2 < length; i2++) {
    const signature = signatures[i2];
    if (isStructSignature(signature))
      continue;
    abi.push(parseSignature(signature, structs));
  }
  return abi;
}
var init_parseAbi = __esm({
  "../../node_modules/abitype/dist/esm/human-readable/parseAbi.js"() {
    init_signatures();
    init_structs();
    init_utils();
  }
});

// ../../node_modules/abitype/dist/esm/exports/index.js
var init_exports = __esm({
  "../../node_modules/abitype/dist/esm/exports/index.js"() {
    init_formatAbiItem();
    init_parseAbi();
  }
});

// ../../node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem2(abiItem, { includeName = false } = {}) {
  if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
var init_formatAbiItem2 = __esm({
  "../../node_modules/viem/_esm/utils/abi/formatAbiItem.js"() {
    init_abi();
  }
});

// ../../node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm({
  "../../node_modules/viem/_esm/utils/data/isHex.js"() {
  }
});

// ../../node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm({
  "../../node_modules/viem/_esm/utils/data/size.js"() {
    init_isHex();
  }
});

// ../../node_modules/viem/_esm/errors/version.js
var version2;
var init_version2 = __esm({
  "../../node_modules/viem/_esm/errors/version.js"() {
    version2 = "2.56.9";
  }
});

// ../../node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var errorConfig, BaseError2;
var init_base = __esm({
  "../../node_modules/viem/_esm/errors/base.js"() {
    init_version2();
    errorConfig = {
      getDocsUrl: ({ docsBaseUrl, docsPath: docsPath3 = "", docsSlug }) => docsPath3 ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath3}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
      version: `viem@${version2}`
    };
    BaseError2 = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.details;
          if (args.cause?.message)
            return args.cause.message;
          return args.details;
        })();
        const docsPath3 = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.docsPath || args.docsPath;
          return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath: docsPath3 });
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsUrl ? [`Docs: ${docsUrl}`] : [],
          ...details ? [`Details: ${details}`] : [],
          ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
        ].join("\n");
        super(message, args.cause ? { cause: args.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.details = details;
        this.docsPath = docsPath3;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version2;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
  }
});

// ../../node_modules/viem/_esm/errors/abi.js
var AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, AbiFunctionNotFoundError, AbiFunctionOutputsNotFoundError, AbiItemAmbiguityError, BytesSizeMismatchError, InvalidAbiEncodingTypeError, InvalidAbiDecodingTypeError, InvalidArrayError, InvalidDefinitionTypeError;
var init_abi = __esm({
  "../../node_modules/viem/_esm/errors/abi.js"() {
    init_formatAbiItem2();
    init_size();
    init_base();
    AbiDecodingDataSizeTooSmallError = class extends BaseError2 {
      constructor({ data, params, size: size2 }) {
        super([`Data size of ${size2} bytes is too small for given parameters.`].join("\n"), {
          metaMessages: [
            `Params: (${formatAbiParams(params, { includeName: true })})`,
            `Data:   ${data} (${size2} bytes)`
          ],
          name: "AbiDecodingDataSizeTooSmallError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size2;
      }
    };
    AbiDecodingZeroDataError = class extends BaseError2 {
      constructor({ cause } = {}) {
        super('Cannot decode zero data ("0x") with ABI parameters.', {
          name: "AbiDecodingZeroDataError",
          cause
        });
      }
    };
    AbiEncodingArrayLengthMismatchError = class extends BaseError2 {
      constructor({ expectedLength, givenLength, type }) {
        super([
          `ABI encoding array length mismatch for type ${type}.`,
          `Expected length: ${expectedLength}`,
          `Given length: ${givenLength}`
        ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
      }
    };
    AbiEncodingBytesSizeMismatchError = class extends BaseError2 {
      constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
      }
    };
    AbiEncodingLengthMismatchError = class extends BaseError2 {
      constructor({ expectedLength, givenLength }) {
        super([
          "ABI encoding params/values length mismatch.",
          `Expected length (params): ${expectedLength}`,
          `Given length (values): ${givenLength}`
        ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
      }
    };
    AbiFunctionNotFoundError = class extends BaseError2 {
      constructor(functionName, { docsPath: docsPath3 } = {}) {
        super([
          `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath: docsPath3,
          name: "AbiFunctionNotFoundError"
        });
      }
    };
    AbiFunctionOutputsNotFoundError = class extends BaseError2 {
      constructor(functionName, { docsPath: docsPath3 }) {
        super([
          `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
          "Cannot decode function result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath: docsPath3,
          name: "AbiFunctionOutputsNotFoundError"
        });
      }
    };
    AbiItemAmbiguityError = class extends BaseError2 {
      constructor(x, y2) {
        super("Found ambiguous types in overloaded ABI items.", {
          metaMessages: [
            `\`${x.type}\` in \`${formatAbiItem2(x.abiItem)}\`, and`,
            `\`${y2.type}\` in \`${formatAbiItem2(y2.abiItem)}\``,
            "",
            "These types encode differently and cannot be distinguished at runtime.",
            "Remove one of the ambiguous items in the ABI."
          ],
          name: "AbiItemAmbiguityError"
        });
      }
    };
    BytesSizeMismatchError = class extends BaseError2 {
      constructor({ expectedSize, givenSize }) {
        super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
          name: "BytesSizeMismatchError"
        });
      }
    };
    InvalidAbiEncodingTypeError = class extends BaseError2 {
      constructor(type, { docsPath: docsPath3 }) {
        super([
          `Type "${type}" is not a valid encoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath: docsPath3, name: "InvalidAbiEncodingType" });
      }
    };
    InvalidAbiDecodingTypeError = class extends BaseError2 {
      constructor(type, { docsPath: docsPath3 }) {
        super([
          `Type "${type}" is not a valid decoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath: docsPath3, name: "InvalidAbiDecodingType" });
      }
    };
    InvalidArrayError = class extends BaseError2 {
      constructor(value) {
        super([`Value "${value}" is not a valid array.`].join("\n"), {
          name: "InvalidArrayError"
        });
      }
    };
    InvalidDefinitionTypeError = class extends BaseError2 {
      constructor(type) {
        super([
          `"${type}" is not a valid definition type.`,
          'Valid types: "function", "event", "error"'
        ].join("\n"), { name: "InvalidDefinitionTypeError" });
      }
    };
  }
});

// ../../node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError;
var init_data = __esm({
  "../../node_modules/viem/_esm/errors/data.js"() {
    init_base();
    SliceOffsetOutOfBoundsError = class extends BaseError2 {
      constructor({ offset, position, size: size2 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size2}).`, { name: "SliceOffsetOutOfBoundsError" });
      }
    };
    SizeExceedsPaddingSizeError = class extends BaseError2 {
      constructor({ size: size2, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size2}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
      }
    };
  }
});

// ../../node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size2 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size2 });
  return padBytes(hexOrBytes, { dir, size: size2 });
}
function padHex(hex_, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size2 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size2,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size2 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return bytes;
  if (bytes.length > size2)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size2,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size2);
  for (let i2 = 0; i2 < size2; i2++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i2 : size2 - i2 - 1] = bytes[padEnd ? i2 : bytes.length - i2 - 1];
  }
  return paddedBytes;
}
var init_pad = __esm({
  "../../node_modules/viem/_esm/utils/data/pad.js"() {
    init_data();
  }
});

// ../../node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, InvalidBytesBooleanError, SizeOverflowError;
var init_encoding = __esm({
  "../../node_modules/viem/_esm/errors/encoding.js"() {
    init_base();
    IntegerOutOfRangeError = class extends BaseError2 {
      constructor({ max, min, signed, size: size2, value }) {
        super(`Number "${value}" is not in safe ${size2 ? `${size2 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
      }
    };
    InvalidBytesBooleanError = class extends BaseError2 {
      constructor(bytes) {
        super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
          name: "InvalidBytesBooleanError"
        });
      }
    };
    SizeOverflowError = class extends BaseError2 {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
      }
    };
  }
});

// ../../node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i2 = 0; i2 < data.length - 1; i2++) {
    if (data[dir === "left" ? i2 : data.length - i2 - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}
var init_trim = __esm({
  "../../node_modules/viem/_esm/utils/data/trim.js"() {
  }
});

// ../../node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size2 }) {
  if (size(hexOrBytes) > size2)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size2
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size2 = Math.ceil((hex.length - 2) / 2);
  const max = (1n << BigInt(size2) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size2 * 2, "f")}`) - 1n;
}
function hexToNumber(hex, opts = {}) {
  const value = hexToBigInt(hex, opts);
  const number = Number(value);
  if (!Number.isSafeInteger(number))
    throw new IntegerOutOfRangeError({
      max: `${Number.MAX_SAFE_INTEGER}`,
      min: `${Number.MIN_SAFE_INTEGER}`,
      signed: opts.signed,
      size: opts.size,
      value: `${value}n`
    });
  return number;
}
var init_fromHex = __esm({
  "../../node_modules/viem/_esm/utils/encoding/fromHex.js"() {
    init_encoding();
    init_size();
  }
});

// ../../node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i2 = 0; i2 < value.length; i2++) {
    string += hexes[value[i2]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size2 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size2) {
    if (signed)
      maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size2,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size2)
    return pad(hex, { size: size2 });
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm({
  "../../node_modules/viem/_esm/utils/encoding/toHex.js"() {
    init_encoding();
    init_pad();
    init_fromHex();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i2) => i2.toString(16).padStart(2, "0"));
    encoder = /* @__PURE__ */ new TextEncoder();
  }
});

// ../../node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { size: opts.size });
  }
  return bytes;
}
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
var encoder2, charCodeMap;
var init_toBytes = __esm({
  "../../node_modules/viem/_esm/utils/encoding/toBytes.js"() {
    init_base();
    init_isHex();
    init_pad();
    init_fromHex();
    init_toHex();
    encoder2 = /* @__PURE__ */ new TextEncoder();
    charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
  }
});

// ../../node_modules/@noble/hashes/esm/_u64.js
function fromBig2(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK642), l: Number(n >> _32n2 & U32_MASK642) };
  return { h: Number(n >> _32n2 & U32_MASK642) | 0, l: Number(n & U32_MASK642) | 0 };
}
function split2(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i2 = 0; i2 < len; i2++) {
    const { h: h2, l } = fromBig2(lst[i2], le);
    [Ah[i2], Al[i2]] = [h2, l];
  }
  return [Ah, Al];
}
var U32_MASK642, _32n2, rotlSH, rotlSL, rotlBH, rotlBL;
var init_u64 = __esm({
  "../../node_modules/@noble/hashes/esm/_u64.js"() {
    U32_MASK642 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    _32n2 = /* @__PURE__ */ BigInt(32);
    rotlSH = (h2, l, s2) => h2 << s2 | l >>> 32 - s2;
    rotlSL = (h2, l, s2) => l << s2 | h2 >>> 32 - s2;
    rotlBH = (h2, l, s2) => l << s2 - 32 | h2 >>> 64 - s2;
    rotlBL = (h2, l, s2) => h2 << s2 - 32 | l >>> 64 - s2;
  }
});

// ../../node_modules/@noble/hashes/esm/cryptoNode.js
import * as nc from "node:crypto";
var crypto2;
var init_cryptoNode = __esm({
  "../../node_modules/@noble/hashes/esm/cryptoNode.js"() {
    crypto2 = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;
  }
});

// ../../node_modules/@noble/hashes/esm/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber2(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes2(b, ...lengths) {
  if (!isBytes2(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash(h2) {
  if (typeof h2 !== "function" || typeof h2.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber2(h2.outputLen);
  anumber2(h2.blockLen);
}
function aexists2(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput2(out, instance) {
  abytes2(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean2(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView2(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr2(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i2 = 0; i2 < arr.length; i2++) {
    arr[i2] = byteSwap(arr[i2]);
  }
  return arr;
}
function utf8ToBytes(str2) {
  if (typeof str2 !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str2));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes2(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    abytes2(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i2 = 0, pad2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function createHasher2(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto2 && typeof crypto2.getRandomValues === "function") {
    return crypto2.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto2 && typeof crypto2.randomBytes === "function") {
    return Uint8Array.from(crypto2.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
var isLE, swap32IfBE, Hash;
var init_utils2 = __esm({
  "../../node_modules/@noble/hashes/esm/utils.js"() {
    init_cryptoNode();
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    swap32IfBE = isLE ? (u2) => u2 : byteSwap32;
    Hash = class {
    };
  }
});

// ../../node_modules/@noble/hashes/esm/sha3.js
function keccakP(s2, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s2[x] ^ s2[x + 10] ^ s2[x + 20] ^ s2[x + 30] ^ s2[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B12 = B[idx0 + 1];
      const Th = rotlH(B0, B12, 1) ^ B[idx1];
      const Tl = rotlL(B0, B12, 1) ^ B[idx1 + 1];
      for (let y2 = 0; y2 < 50; y2 += 10) {
        s2[x + y2] ^= Th;
        s2[x + y2 + 1] ^= Tl;
      }
    }
    let curH = s2[2];
    let curL = s2[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s2[PI];
      curL = s2[PI + 1];
      s2[PI] = Th;
      s2[PI + 1] = Tl;
    }
    for (let y2 = 0; y2 < 50; y2 += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s2[y2 + x];
      for (let x = 0; x < 10; x++)
        s2[y2 + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s2[0] ^= SHA3_IOTA_H[round];
    s2[1] ^= SHA3_IOTA_L[round];
  }
  clean2(B);
}
var _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, keccak_256;
var init_sha3 = __esm({
  "../../node_modules/@noble/hashes/esm/sha3.js"() {
    init_u64();
    init_utils2();
    _0n = BigInt(0);
    _1n = BigInt(1);
    _2n = BigInt(2);
    _7n = BigInt(7);
    _256n = BigInt(256);
    _0x71n = BigInt(113);
    SHA3_PI = [];
    SHA3_ROTL = [];
    _SHA3_IOTA = [];
    for (let round = 0, R2 = _1n, x = 1, y2 = 0; round < 24; round++) {
      [x, y2] = [y2, (2 * x + 3 * y2) % 5];
      SHA3_PI.push(2 * (5 * y2 + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n;
      for (let j = 0; j < 7; j++) {
        R2 = (R2 << _1n ^ (R2 >> _7n) * _0x71n) % _256n;
        if (R2 & _2n)
          t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
      }
      _SHA3_IOTA.push(t);
    }
    IOTAS = split2(_SHA3_IOTA, true);
    SHA3_IOTA_H = IOTAS[0];
    SHA3_IOTA_L = IOTAS[1];
    rotlH = (h2, l, s2) => s2 > 32 ? rotlBH(h2, l, s2) : rotlSH(h2, l, s2);
    rotlL = (h2, l, s2) => s2 > 32 ? rotlBL(h2, l, s2) : rotlSL(h2, l, s2);
    Keccak = class _Keccak extends Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        anumber2(outputLen);
        if (!(0 < blockLen && blockLen < 200))
          throw new Error("only keccak-f1600 function is supported");
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
      }
      clone() {
        return this._cloneInto();
      }
      keccak() {
        swap32IfBE(this.state32);
        keccakP(this.state32, this.rounds);
        swap32IfBE(this.state32);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        aexists2(this);
        data = toBytes2(data);
        abytes2(data);
        const { blockLen, state } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i2 = 0; i2 < take; i2++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        aexists2(this, false);
        abytes2(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes) {
        anumber2(bytes);
        return this.xofInto(new Uint8Array(bytes));
      }
      digestInto(out) {
        aoutput2(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        clean2(this.state);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    gen = (suffix, blockLen, outputLen) => createHasher2(() => new Keccak(blockLen, suffix, outputLen));
    keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
  }
});

// ../../node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
var init_keccak256 = __esm({
  "../../node_modules/viem/_esm/utils/hash/keccak256.js"() {
    init_sha3();
    init_isHex();
    init_toBytes();
    init_toHex();
  }
});

// ../../node_modules/viem/_esm/utils/hash/hashSignature.js
function hashSignature(sig) {
  return hash(sig);
}
var hash;
var init_hashSignature = __esm({
  "../../node_modules/viem/_esm/utils/hash/hashSignature.js"() {
    init_toBytes();
    init_keccak256();
    hash = (value) => keccak256(toBytes(value));
  }
});

// ../../node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i2 = 0; i2 < signature.length; i2++) {
    const char = signature[i2];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i2 - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError2("Unable to normalize signature.");
  return result;
}
var init_normalizeSignature = __esm({
  "../../node_modules/viem/_esm/utils/hash/normalizeSignature.js"() {
    init_base();
  }
});

// ../../node_modules/viem/_esm/utils/hash/toSignature.js
var toSignature;
var init_toSignature = __esm({
  "../../node_modules/viem/_esm/utils/hash/toSignature.js"() {
    init_exports();
    init_normalizeSignature();
    toSignature = (def) => {
      const def_ = (() => {
        if (typeof def === "string")
          return def;
        return formatAbiItem(def);
      })();
      return normalizeSignature(def_);
    };
  }
});

// ../../node_modules/viem/_esm/utils/hash/toSignatureHash.js
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}
var init_toSignatureHash = __esm({
  "../../node_modules/viem/_esm/utils/hash/toSignatureHash.js"() {
    init_hashSignature();
    init_toSignature();
  }
});

// ../../node_modules/viem/_esm/utils/hash/toEventSelector.js
var toEventSelector;
var init_toEventSelector = __esm({
  "../../node_modules/viem/_esm/utils/hash/toEventSelector.js"() {
    init_toSignatureHash();
    toEventSelector = toSignatureHash;
  }
});

// ../../node_modules/viem/_esm/errors/address.js
var InvalidAddressError;
var init_address = __esm({
  "../../node_modules/viem/_esm/errors/address.js"() {
    init_base();
    InvalidAddressError = class extends BaseError2 {
      constructor({ address: address2 }) {
        super(`Address "${address2}" is invalid.`, {
          metaMessages: [
            "- Address must be a hex value of 20 bytes (40 hex characters).",
            "- Address must match its checksum counterpart."
          ],
          name: "InvalidAddressError"
        });
      }
    };
  }
});

// ../../node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esm({
  "../../node_modules/viem/_esm/utils/lru.js"() {
    LruMap = class extends Map {
      constructor(size2) {
        super();
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = size2;
      }
      get(key) {
        const value = super.get(key);
        if (super.has(key)) {
          super.delete(key);
          super.set(key, value);
        }
        return value;
      }
      set(key, value) {
        if (super.has(key))
          super.delete(key);
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
          const firstKey = super.keys().next().value;
          if (firstKey !== void 0)
            super.delete(firstKey);
        }
        return this;
      }
    };
  }
});

// ../../node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash2 = keccak256(stringToBytes(hexAddress), "bytes");
  const address2 = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i2 = 0; i2 < 40; i2 += 2) {
    if (hash2[i2 >> 1] >> 4 >= 8 && address2[i2]) {
      address2[i2] = address2[i2].toUpperCase();
    }
    if ((hash2[i2 >> 1] & 15) >= 8 && address2[i2 + 1]) {
      address2[i2 + 1] = address2[i2 + 1].toUpperCase();
    }
  }
  const result = `0x${address2.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
var checksumAddressCache;
var init_getAddress = __esm({
  "../../node_modules/viem/_esm/utils/address/getAddress.js"() {
    init_toBytes();
    init_keccak256();
    init_lru();
    checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// ../../node_modules/viem/_esm/utils/address/isAddress.js
function isAddress(address2, options) {
  const { strict = true } = options ?? {};
  const cacheKey = `${address2}.${strict}`;
  if (isAddressCache.has(cacheKey))
    return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address2))
      return false;
    if (address2.toLowerCase() === address2)
      return true;
    if (strict)
      return checksumAddress(address2) === address2;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}
var addressRegex, isAddressCache;
var init_isAddress = __esm({
  "../../node_modules/viem/_esm/utils/address/isAddress.js"() {
    init_lru();
    init_getAddress();
    addressRegex = /^0x[a-fA-F0-9]{40}$/;
    isAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// ../../node_modules/viem/_esm/utils/data/concat.js
function concat(values) {
  if (typeof values[0] === "string")
    return concatHex(values);
  return concatBytes2(values);
}
function concatBytes2(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
var init_concat = __esm({
  "../../node_modules/viem/_esm/utils/data/concat.js"() {
  }
});

// ../../node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size(value)
    });
  }
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var init_slice = __esm({
  "../../node_modules/viem/_esm/utils/data/slice.js"() {
    init_data();
    init_isHex();
    init_size();
  }
});

// ../../node_modules/viem/_esm/utils/regex.js
var bytesRegex2, integerRegex2;
var init_regex2 = __esm({
  "../../node_modules/viem/_esm/utils/regex.js"() {
    bytesRegex2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  }
});

// ../../node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  return encodeParams(preparedParams);
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i2 = 0; i2 < params.length; i2++) {
    preparedParams.push(prepareParam({ param: params[i2], value: values[i2] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    const [, , size2 = "256"] = integerRegex2.exec(param.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size2)
    });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i2 = 0; i2 < preparedParams.length; i2++) {
    const { dynamic, encoded } = preparedParams[i2];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i2 = 0; i2 < preparedParams.length; i2++) {
    const { dynamic, encoded } = preparedParams[i2];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concatHex([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = value.length === 0 && isDynamicType(param);
  const preparedParams = [];
  for (let i2 = 0; i2 < value.length; i2++) {
    const preparedParam = prepareParam({ param, value: value[i2] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: concatHex([length2, data])
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concatHex([
        padHex(numberToHex(bytesSize, { size: 32 })),
        value_
      ])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize, 10))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize, 10),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size: size2 = 256 }) {
  if (typeof size2 === "number") {
    const max = 2n ** (BigInt(size2) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size2 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i2 = 0; i2 < partsLength; i2++) {
    parts.push(padHex(slice(hexValue, i2 * 32, (i2 + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concatHex([
      padHex(numberToHex(size(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i2 = 0; i2 < param.components.length; i2++) {
    const param_ = param.components[i2];
    const index = Array.isArray(value) ? i2 : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
function isDynamicType(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components.some(isDynamicType);
  const arrayComponents = getArrayComponents(type);
  if (arrayComponents)
    return isDynamicType({ ...param, type: arrayComponents[1] });
  return false;
}
var init_encodeAbiParameters = __esm({
  "../../node_modules/viem/_esm/utils/abi/encodeAbiParameters.js"() {
    init_abi();
    init_address();
    init_base();
    init_encoding();
    init_isAddress();
    init_concat();
    init_pad();
    init_size();
    init_slice();
    init_toHex();
    init_regex2();
  }
});

// ../../node_modules/viem/_esm/utils/hash/toFunctionSelector.js
var toFunctionSelector;
var init_toFunctionSelector = __esm({
  "../../node_modules/viem/_esm/utils/hash/toFunctionSelector.js"() {
    init_slice();
    init_toSignatureHash();
    toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
  }
});

// ../../node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
  const { abi, args = [], name } = parameters;
  const isSelector = isHex(name, { strict: false });
  const abiItems = abi.filter((abiItem) => {
    if (isSelector) {
      if (abiItem.type === "function")
        return toFunctionSelector(abiItem) === name;
      if (abiItem.type === "event")
        return toEventSelector(abiItem) === name;
      return false;
    }
    return "name" in abiItem && abiItem.name === name;
  });
  if (abiItems.length === 0)
    return void 0;
  if (abiItems.length === 1)
    return abiItems[0];
  let matchedAbiItem;
  for (const abiItem of abiItems) {
    if (!("inputs" in abiItem))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem.inputs || abiItem.inputs.length === 0)
        return abiItem;
      continue;
    }
    if (!abiItem.inputs)
      continue;
    if (abiItem.inputs.length === 0)
      continue;
    if (abiItem.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index) => {
      const abiParameter = "inputs" in abiItem && abiItem.inputs[index];
      if (!abiParameter)
        return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AbiItemAmbiguityError({
            abiItem,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem;
    }
  }
  if (matchedAbiItem)
    return matchedAbiItem;
  return abiItems[0];
}
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return isAddress(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index) => {
          return argType === "object" && isArgOfType(Object.values(arg)[index], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter,
          // Pop off `[]` or `[M]` from end of type
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return isAddress(args[parameterIndex], { strict: false });
      if (types.includes("address") && types.includes("bytes"))
        return isAddress(args[parameterIndex], { strict: false });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}
var init_getAbiItem = __esm({
  "../../node_modules/viem/_esm/utils/abi/getAbiItem.js"() {
    init_abi();
    init_isHex();
    init_isAddress();
    init_toEventSelector();
    init_toFunctionSelector();
  }
});

// ../../node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
function prepareEncodeFunctionData(parameters) {
  const { abi, args, functionName } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({
      abi,
      args,
      name: functionName
    });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath });
  return {
    abi: [abiItem],
    functionName: toFunctionSelector(formatAbiItem2(abiItem))
  };
}
var docsPath;
var init_prepareEncodeFunctionData = __esm({
  "../../node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js"() {
    init_abi();
    init_toFunctionSelector();
    init_formatAbiItem2();
    init_getAbiItem();
    docsPath = "/docs/contract/encodeFunctionData";
  }
});

// ../../node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
  const { args } = parameters;
  const { abi, functionName } = (() => {
    if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
      return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem = abi[0];
  const signature = functionName;
  const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0;
  return concatHex([signature, data ?? "0x"]);
}
var init_encodeFunctionData = __esm({
  "../../node_modules/viem/_esm/utils/abi/encodeFunctionData.js"() {
    init_concat();
    init_encodeAbiParameters();
    init_prepareEncodeFunctionData();
  }
});

// ../../node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
var init_cursor = __esm({
  "../../node_modules/viem/_esm/errors/cursor.js"() {
    init_base();
    NegativeOffsetError = class extends BaseError2 {
      constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
          name: "NegativeOffsetError"
        });
      }
    };
    PositionOutOfBoundsError = class extends BaseError2 {
      constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
      }
    };
    RecursiveReadLimitExceededError = class extends BaseError2 {
      constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
      }
    };
  }
});

// ../../node_modules/viem/_esm/utils/cursor.js
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer ?? bytes, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = /* @__PURE__ */ new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
var staticCursor;
var init_cursor2 = __esm({
  "../../node_modules/viem/_esm/utils/cursor.js"() {
    init_cursor();
    staticCursor = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      positionReadCount: /* @__PURE__ */ new Map(),
      recursiveReadCount: 0,
      recursiveReadLimit: Number.POSITIVE_INFINITY,
      assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
          throw new RecursiveReadLimitExceededError({
            count: this.recursiveReadCount + 1,
            limit: this.recursiveReadLimit
          });
      },
      assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
          throw new PositionOutOfBoundsError({
            length: this.bytes.length,
            position
          });
      },
      decrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
      },
      getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
      },
      incrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
      },
      inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
      },
      inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
      },
      inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
      },
      inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
      },
      pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
      },
      pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
      },
      pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
      },
      pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
      },
      pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
      },
      pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
      },
      readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
      },
      readBytes(length, size2) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size2 ?? length;
        return value;
      },
      readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
      },
      readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
      },
      readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
      },
      readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
      },
      get remaining() {
        return this.bytes.length - this.position;
      },
      setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => this.position = oldPosition;
      },
      _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
          return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
          this.recursiveReadCount++;
      }
    };
  }
});

// ../../node_modules/viem/_esm/utils/encoding/fromBytes.js
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes);
  return hexToBigInt(hex, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1)
    throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes);
  return hexToNumber(hex, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes, { dir: "right" });
  }
  return new TextDecoder().decode(bytes);
}
var init_fromBytes = __esm({
  "../../node_modules/viem/_esm/utils/encoding/fromBytes.js"() {
    init_encoding();
    init_trim();
    init_fromHex();
    init_toHex();
  }
});

// ../../node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
  const bytes = typeof data === "string" ? hexToBytes(data) : data;
  const cursor = createCursor(bytes);
  if (size(bytes) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError();
  if (size(data) && size(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data === "string" ? data : bytesToHex(data),
      params,
      size: size(data)
    });
  let consumed = 0;
  const values = [];
  for (let i2 = 0; i2 < params.length; ++i2) {
    const param = params[i2];
    if (consumed < bytes.length)
      cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data2);
  }
  return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, { ...param, type }, { length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, { staticPosition });
  if (param.type === "address")
    return decodeAddress(cursor);
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
  if (length === null) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i2 = 0; i2 < length2; ++i2) {
      cursor.setPosition(startOfData + (dynamicChild ? i2 * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
      if (consumed_ === 0) {
        cursor.assertReadLimit();
        cursor._touch();
      }
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i2 = 0; i2 < length; ++i2) {
      cursor.setPosition(start + i2 * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i2 = 0; i2 < length; ++i2) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
    if (consumed_ === 0) {
      cursor.assertReadLimit();
      cursor._touch();
    }
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size2] = param.type.split("bytes");
  if (!size2) {
    const offset = bytesToNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex(data), 32];
  }
  const value = bytesToHex(cursor.readBytes(Number.parseInt(size2, 10), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size2 = Number.parseInt(param.type.split("int")[1] || "256", 10);
  const value = cursor.readBytes(32);
  return [
    size2 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, { staticPosition }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i2 = 0; i2 < param.components.length; ++i2) {
      const component = param.components[i2];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i2 : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i2 = 0; i2 < param.components.length; ++i2) {
    const component = param.components[i2];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i2 : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = bytesToNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(data);
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}
var sizeOfLength, sizeOfOffset;
var init_decodeAbiParameters = __esm({
  "../../node_modules/viem/_esm/utils/abi/decodeAbiParameters.js"() {
    init_abi();
    init_getAddress();
    init_cursor2();
    init_size();
    init_slice();
    init_fromBytes();
    init_toBytes();
    init_toHex();
    init_encodeAbiParameters();
    sizeOfLength = 32;
    sizeOfOffset = 32;
  }
});

// ../../node_modules/viem/_esm/utils/stringify.js
var stringify;
var init_stringify = __esm({
  "../../node_modules/viem/_esm/utils/stringify.js"() {
    stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
      const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value2) : value2;
    }, space);
  }
});

// ../../node_modules/viem/_esm/utils/unit/Value.js
function format(value, decimals = 0) {
  if (!Number.isInteger(decimals) || decimals < 0)
    throw new InvalidDecimalsError({ decimals });
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer2, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer2 || "0"}${fraction ? `.${fraction}` : ""}`;
}
function formatGwei(wei, unit = "wei") {
  return format(wei, exponents.gwei - exponents[unit]);
}
var exponents, InvalidDecimalsError;
var init_Value = __esm({
  "../../node_modules/viem/_esm/utils/unit/Value.js"() {
    exponents = {
      wei: 0,
      gwei: 9,
      szabo: 12,
      finney: 15,
      ether: 18
    };
    InvalidDecimalsError = class extends Error {
      constructor({ decimals }) {
        super(`\`decimals\` must be a non-negative integer. Got \`${decimals}\`.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Value.InvalidDecimalsError"
        });
      }
    };
  }
});

// ../../node_modules/viem/_esm/utils/unit/formatGwei.js
function formatGwei2(wei, unit = "wei") {
  return formatGwei(wei, unit);
}
var init_formatGwei = __esm({
  "../../node_modules/viem/_esm/utils/unit/formatGwei.js"() {
    init_Value();
  }
});

// ../../node_modules/viem/_esm/errors/transaction.js
function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === void 0 || value === false)
      return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
}
var InvalidLegacyVError, InvalidSerializableTransactionError, InvalidStorageKeySizeError;
var init_transaction = __esm({
  "../../node_modules/viem/_esm/errors/transaction.js"() {
    init_base();
    InvalidLegacyVError = class extends BaseError2 {
      constructor({ v }) {
        super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
          name: "InvalidLegacyVError"
        });
      }
    };
    InvalidSerializableTransactionError = class extends BaseError2 {
      constructor({ transaction }) {
        super("Cannot infer a transaction type from provided transaction.", {
          metaMessages: [
            "Provided Transaction:",
            "{",
            prettyPrint(transaction),
            "}",
            "",
            "To infer the type, either provide:",
            "- a `type` to the Transaction, or",
            "- an EIP-1559 Transaction with `maxFeePerGas`, or",
            "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
            "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
            "- an EIP-7702 Transaction with `authorizationList`, or",
            "- a Legacy Transaction with `gasPrice`"
          ],
          name: "InvalidSerializableTransactionError"
        });
      }
    };
    InvalidStorageKeySizeError = class extends BaseError2 {
      constructor({ storageKey }) {
        super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, { name: "InvalidStorageKeySizeError" });
      }
    };
  }
});

// ../../node_modules/viem/_esm/errors/node.js
var ExecutionRevertedError, FeeCapTooHighError, FeeCapTooLowError, NonceTooHighError, NonceTooLowError, NonceMaxValueError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, TransactionTypeNotSupportedError, TipAboveFeeCapError;
var init_node = __esm({
  "../../node_modules/viem/_esm/errors/node.js"() {
    init_formatGwei();
    init_base();
    ExecutionRevertedError = class extends BaseError2 {
      constructor({ cause, message } = {}) {
        const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
        super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
          cause,
          name: "ExecutionRevertedError"
        });
      }
    };
    Object.defineProperty(ExecutionRevertedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /execution reverted|gas required exceeds allowance/
    });
    FeeCapTooHighError = class extends BaseError2 {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
          cause,
          name: "FeeCapTooHighError"
        });
      }
    };
    Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
    });
    FeeCapTooLowError = class extends BaseError2 {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
          cause,
          name: "FeeCapTooLowError"
        });
      }
    };
    Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
    });
    NonceTooHighError = class extends BaseError2 {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
      }
    };
    Object.defineProperty(NonceTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too high/
    });
    NonceTooLowError = class extends BaseError2 {
      constructor({ cause, nonce } = {}) {
        super([
          `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
          "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
        ].join("\n"), { cause, name: "NonceTooLowError" });
      }
    };
    Object.defineProperty(NonceTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too low|transaction already imported|already known/
    });
    NonceMaxValueError = class extends BaseError2 {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
      }
    };
    Object.defineProperty(NonceMaxValueError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce has max value/
    });
    InsufficientFundsError = class extends BaseError2 {
      constructor({ cause } = {}) {
        super([
          "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
        ].join("\n"), {
          cause,
          metaMessages: [
            "This error could arise when the account does not have enough funds to:",
            " - pay for the total gas fee,",
            " - pay for the value to send.",
            " ",
            "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
            " - `gas` is the amount of gas needed for transaction to execute,",
            " - `gas fee` is the gas fee,",
            " - `value` is the amount of ether to send to the recipient."
          ],
          name: "InsufficientFundsError"
        });
      }
    };
    Object.defineProperty(InsufficientFundsError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /insufficient funds|exceeds transaction sender account balance/
    });
    IntrinsicGasTooHighError = class extends BaseError2 {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
          cause,
          name: "IntrinsicGasTooHighError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too high|gas limit reached/
    });
    IntrinsicGasTooLowError = class extends BaseError2 {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
          cause,
          name: "IntrinsicGasTooLowError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too low/
    });
    TransactionTypeNotSupportedError = class extends BaseError2 {
      constructor({ cause }) {
        super("The transaction type is not supported for this chain.", {
          cause,
          name: "TransactionTypeNotSupportedError"
        });
      }
    };
    Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /transaction type not valid/
    });
    TipAboveFeeCapError = class extends BaseError2 {
      constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
        super([
          `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei2(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)} gwei` : ""}).`
        ].join("\n"), {
          cause,
          name: "TipAboveFeeCapError"
        });
      }
    };
    Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
    });
  }
});

// ../../node_modules/viem/_esm/constants/number.js
var maxInt8, maxInt16, maxInt24, maxInt32, maxInt40, maxInt48, maxInt56, maxInt64, maxInt72, maxInt80, maxInt88, maxInt96, maxInt104, maxInt112, maxInt120, maxInt128, maxInt136, maxInt144, maxInt152, maxInt160, maxInt168, maxInt176, maxInt184, maxInt192, maxInt200, maxInt208, maxInt216, maxInt224, maxInt232, maxInt240, maxInt248, maxInt256, minInt8, minInt16, minInt24, minInt32, minInt40, minInt48, minInt56, minInt64, minInt72, minInt80, minInt88, minInt96, minInt104, minInt112, minInt120, minInt128, minInt136, minInt144, minInt152, minInt160, minInt168, minInt176, minInt184, minInt192, minInt200, minInt208, minInt216, minInt224, minInt232, minInt240, minInt248, minInt256, maxUint8, maxUint16, maxUint24, maxUint32, maxUint40, maxUint48, maxUint56, maxUint64, maxUint72, maxUint80, maxUint88, maxUint96, maxUint104, maxUint112, maxUint120, maxUint128, maxUint136, maxUint144, maxUint152, maxUint160, maxUint168, maxUint176, maxUint184, maxUint192, maxUint200, maxUint208, maxUint216, maxUint224, maxUint232, maxUint240, maxUint248, maxUint256;
var init_number = __esm({
  "../../node_modules/viem/_esm/constants/number.js"() {
    maxInt8 = 2n ** (8n - 1n) - 1n;
    maxInt16 = 2n ** (16n - 1n) - 1n;
    maxInt24 = 2n ** (24n - 1n) - 1n;
    maxInt32 = 2n ** (32n - 1n) - 1n;
    maxInt40 = 2n ** (40n - 1n) - 1n;
    maxInt48 = 2n ** (48n - 1n) - 1n;
    maxInt56 = 2n ** (56n - 1n) - 1n;
    maxInt64 = 2n ** (64n - 1n) - 1n;
    maxInt72 = 2n ** (72n - 1n) - 1n;
    maxInt80 = 2n ** (80n - 1n) - 1n;
    maxInt88 = 2n ** (88n - 1n) - 1n;
    maxInt96 = 2n ** (96n - 1n) - 1n;
    maxInt104 = 2n ** (104n - 1n) - 1n;
    maxInt112 = 2n ** (112n - 1n) - 1n;
    maxInt120 = 2n ** (120n - 1n) - 1n;
    maxInt128 = 2n ** (128n - 1n) - 1n;
    maxInt136 = 2n ** (136n - 1n) - 1n;
    maxInt144 = 2n ** (144n - 1n) - 1n;
    maxInt152 = 2n ** (152n - 1n) - 1n;
    maxInt160 = 2n ** (160n - 1n) - 1n;
    maxInt168 = 2n ** (168n - 1n) - 1n;
    maxInt176 = 2n ** (176n - 1n) - 1n;
    maxInt184 = 2n ** (184n - 1n) - 1n;
    maxInt192 = 2n ** (192n - 1n) - 1n;
    maxInt200 = 2n ** (200n - 1n) - 1n;
    maxInt208 = 2n ** (208n - 1n) - 1n;
    maxInt216 = 2n ** (216n - 1n) - 1n;
    maxInt224 = 2n ** (224n - 1n) - 1n;
    maxInt232 = 2n ** (232n - 1n) - 1n;
    maxInt240 = 2n ** (240n - 1n) - 1n;
    maxInt248 = 2n ** (248n - 1n) - 1n;
    maxInt256 = 2n ** (256n - 1n) - 1n;
    minInt8 = -(2n ** (8n - 1n));
    minInt16 = -(2n ** (16n - 1n));
    minInt24 = -(2n ** (24n - 1n));
    minInt32 = -(2n ** (32n - 1n));
    minInt40 = -(2n ** (40n - 1n));
    minInt48 = -(2n ** (48n - 1n));
    minInt56 = -(2n ** (56n - 1n));
    minInt64 = -(2n ** (64n - 1n));
    minInt72 = -(2n ** (72n - 1n));
    minInt80 = -(2n ** (80n - 1n));
    minInt88 = -(2n ** (88n - 1n));
    minInt96 = -(2n ** (96n - 1n));
    minInt104 = -(2n ** (104n - 1n));
    minInt112 = -(2n ** (112n - 1n));
    minInt120 = -(2n ** (120n - 1n));
    minInt128 = -(2n ** (128n - 1n));
    minInt136 = -(2n ** (136n - 1n));
    minInt144 = -(2n ** (144n - 1n));
    minInt152 = -(2n ** (152n - 1n));
    minInt160 = -(2n ** (160n - 1n));
    minInt168 = -(2n ** (168n - 1n));
    minInt176 = -(2n ** (176n - 1n));
    minInt184 = -(2n ** (184n - 1n));
    minInt192 = -(2n ** (192n - 1n));
    minInt200 = -(2n ** (200n - 1n));
    minInt208 = -(2n ** (208n - 1n));
    minInt216 = -(2n ** (216n - 1n));
    minInt224 = -(2n ** (224n - 1n));
    minInt232 = -(2n ** (232n - 1n));
    minInt240 = -(2n ** (240n - 1n));
    minInt248 = -(2n ** (248n - 1n));
    minInt256 = -(2n ** (256n - 1n));
    maxUint8 = 2n ** 8n - 1n;
    maxUint16 = 2n ** 16n - 1n;
    maxUint24 = 2n ** 24n - 1n;
    maxUint32 = 2n ** 32n - 1n;
    maxUint40 = 2n ** 40n - 1n;
    maxUint48 = 2n ** 48n - 1n;
    maxUint56 = 2n ** 56n - 1n;
    maxUint64 = 2n ** 64n - 1n;
    maxUint72 = 2n ** 72n - 1n;
    maxUint80 = 2n ** 80n - 1n;
    maxUint88 = 2n ** 88n - 1n;
    maxUint96 = 2n ** 96n - 1n;
    maxUint104 = 2n ** 104n - 1n;
    maxUint112 = 2n ** 112n - 1n;
    maxUint120 = 2n ** 120n - 1n;
    maxUint128 = 2n ** 128n - 1n;
    maxUint136 = 2n ** 136n - 1n;
    maxUint144 = 2n ** 144n - 1n;
    maxUint152 = 2n ** 152n - 1n;
    maxUint160 = 2n ** 160n - 1n;
    maxUint168 = 2n ** 168n - 1n;
    maxUint176 = 2n ** 176n - 1n;
    maxUint184 = 2n ** 184n - 1n;
    maxUint192 = 2n ** 192n - 1n;
    maxUint200 = 2n ** 200n - 1n;
    maxUint208 = 2n ** 208n - 1n;
    maxUint216 = 2n ** 216n - 1n;
    maxUint224 = 2n ** 224n - 1n;
    maxUint232 = 2n ** 232n - 1n;
    maxUint240 = 2n ** 240n - 1n;
    maxUint248 = 2n ** 248n - 1n;
    maxUint256 = 2n ** 256n - 1n;
  }
});

// ../../node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n3 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n3 & _u32_max);
  const wl = Number(value & _u32_max);
  const h2 = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h2, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi2(a, b, c2) {
  return a & b ^ ~a & c2;
}
function Maj2(a, b, c2) {
  return a & b ^ a & c2 ^ b & c2;
}
var HashMD2, SHA256_IV2;
var init_md = __esm({
  "../../node_modules/@noble/hashes/esm/_md.js"() {
    init_utils2();
    HashMD2 = class extends Hash {
      constructor(blockLen, outputLen, padOffset, isLE2) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE2;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView2(this.buffer);
      }
      update(data) {
        aexists2(this);
        data = toBytes2(data);
        abytes2(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView2(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists2(this);
        aoutput2(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        clean2(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i2 = pos; i2 < blockLen; i2++)
          buffer[i2] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
        const oview = createView2(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i2 = 0; i2 < outLen; i2++)
          oview.setUint32(4 * i2, state[i2], isLE2);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV2 = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
  }
});

// ../../node_modules/@noble/hashes/esm/sha2.js
var SHA256_K2, SHA256_W2, SHA256, sha2562;
var init_sha2 = __esm({
  "../../node_modules/@noble/hashes/esm/sha2.js"() {
    init_md();
    init_utils2();
    SHA256_K2 = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W2 = /* @__PURE__ */ new Uint32Array(64);
    SHA256 = class extends HashMD2 {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = SHA256_IV2[0] | 0;
        this.B = SHA256_IV2[1] | 0;
        this.C = SHA256_IV2[2] | 0;
        this.D = SHA256_IV2[3] | 0;
        this.E = SHA256_IV2[4] | 0;
        this.F = SHA256_IV2[5] | 0;
        this.G = SHA256_IV2[6] | 0;
        this.H = SHA256_IV2[7] | 0;
      }
      get() {
        const { A, B, C: C2, D, E: E2, F, G, H } = this;
        return [A, B, C2, D, E2, F, G, H];
      }
      // prettier-ignore
      set(A, B, C2, D, E2, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C2 | 0;
        this.D = D | 0;
        this.E = E2 | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i2 = 0; i2 < 16; i2++, offset += 4)
          SHA256_W2[i2] = view.getUint32(offset, false);
        for (let i2 = 16; i2 < 64; i2++) {
          const W15 = SHA256_W2[i2 - 15];
          const W2 = SHA256_W2[i2 - 2];
          const s0 = rotr2(W15, 7) ^ rotr2(W15, 18) ^ W15 >>> 3;
          const s12 = rotr2(W2, 17) ^ rotr2(W2, 19) ^ W2 >>> 10;
          SHA256_W2[i2] = s12 + SHA256_W2[i2 - 7] + s0 + SHA256_W2[i2 - 16] | 0;
        }
        let { A, B, C: C2, D, E: E2, F, G, H } = this;
        for (let i2 = 0; i2 < 64; i2++) {
          const sigma1 = rotr2(E2, 6) ^ rotr2(E2, 11) ^ rotr2(E2, 25);
          const T12 = H + sigma1 + Chi2(E2, F, G) + SHA256_K2[i2] + SHA256_W2[i2] | 0;
          const sigma0 = rotr2(A, 2) ^ rotr2(A, 13) ^ rotr2(A, 22);
          const T2 = sigma0 + Maj2(A, B, C2) | 0;
          H = G;
          G = F;
          F = E2;
          E2 = D + T12 | 0;
          D = C2;
          C2 = B;
          B = A;
          A = T12 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C2 = C2 + this.C | 0;
        D = D + this.D | 0;
        E2 = E2 + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C2, D, E2, F, G, H);
      }
      roundClean() {
        clean2(SHA256_W2);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean2(this.buffer);
      }
    };
    sha2562 = /* @__PURE__ */ createHasher2(() => new SHA256());
  }
});

// ../../node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
function decodeFunctionResult(parameters) {
  const { abi, args, functionName, data } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({ abi, args, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath2 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath2 });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath2 });
  const values = decodeAbiParameters(abiItem.outputs, data);
  if (values && values.length > 1)
    return values;
  if (values && values.length === 1)
    return values[0];
  return void 0;
}
var docsPath2;
var init_decodeFunctionResult = __esm({
  "../../node_modules/viem/_esm/utils/abi/decodeFunctionResult.js"() {
    init_abi();
    init_decodeAbiParameters();
    init_getAbiItem();
    docsPath2 = "/docs/contract/decodeFunctionResult";
  }
});

// ../../node_modules/@noble/curves/esm/abstract/utils.js
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes3(item) {
  if (!isBytes3(item))
    throw new Error("Uint8Array expected");
}
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(title + " boolean expected, got " + value);
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n2 : BigInt("0x" + hex);
}
function bytesToHex2(bytes) {
  abytes3(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i2 = 0; i2 < bytes.length; i2++) {
    hex += hexes2[bytes[i2]];
  }
  return hex;
}
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n12 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n12 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n12 * 16 + n2;
  }
  return array;
}
function bytesToNumberBE(bytes) {
  return hexToNumber2(bytesToHex2(bytes));
}
function bytesToNumberLE(bytes) {
  abytes3(bytes);
  return hexToNumber2(bytesToHex2(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes2(hex);
    } catch (e2) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e2);
    }
  } else if (isBytes3(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function concatBytes3(...arrays) {
  let sum = 0;
  for (let i2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    abytes3(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i2 = 0, pad2 = 0; i2 < arrays.length; i2++) {
    const a = arrays[i2];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n2; n >>= _1n2, len += 1)
    ;
  return len;
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i2 = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i2 = 0;
  };
  const h2 = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n(0)) => {
    k = h2(u8fr([0]), seed);
    v = h2();
    if (seed.length === 0)
      return;
    k = h2(u8fr([1]), seed);
    v = h2();
  };
  const gen2 = () => {
    if (i2++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h2();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes3(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen2())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error("invalid validator function");
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
var _0n2, _1n2, hasHexBuiltin, hexes2, asciis, isPosBig, bitMask, u8n, u8fr, validatorFns;
var init_utils3 = __esm({
  "../../node_modules/@noble/curves/esm/abstract/utils.js"() {
    _0n2 = /* @__PURE__ */ BigInt(0);
    _1n2 = /* @__PURE__ */ BigInt(1);
    hasHexBuiltin = // @ts-ignore
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function";
    hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i2) => i2.toString(16).padStart(2, "0"));
    asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    isPosBig = (n) => typeof n === "bigint" && _0n2 <= n;
    bitMask = (n) => (_1n2 << BigInt(n)) - _1n2;
    u8n = (len) => new Uint8Array(len);
    u8fr = (arr) => Uint8Array.from(arr);
    validatorFns = {
      bigint: (val) => typeof val === "bigint",
      function: (val) => typeof val === "function",
      boolean: (val) => typeof val === "boolean",
      string: (val) => typeof val === "string",
      stringOrUint8Array: (val) => typeof val === "string" || isBytes3(val),
      isSafeInteger: (val) => Number.isSafeInteger(val),
      array: (val) => Array.isArray(val),
      field: (val, object) => object.Fp.isValid(val),
      hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
    };
  }
});

// ../../node_modules/viem/_esm/errors/chain.js
var InvalidChainIdError;
var init_chain = __esm({
  "../../node_modules/viem/_esm/errors/chain.js"() {
    init_base();
    InvalidChainIdError = class extends BaseError2 {
      constructor({ chainId }) {
        super(typeof chainId === "number" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.", { name: "InvalidChainIdError" });
      }
    };
  }
});

// ../../node_modules/@noble/hashes/esm/hmac.js
var HMAC, hmac;
var init_hmac = __esm({
  "../../node_modules/@noble/hashes/esm/hmac.js"() {
    init_utils2();
    HMAC = class extends Hash {
      constructor(hash2, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        ahash(hash2);
        const key = toBytes2(_key);
        this.iHash = hash2.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad2 = new Uint8Array(blockLen);
        pad2.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
        for (let i2 = 0; i2 < pad2.length; i2++)
          pad2[i2] ^= 54;
        this.iHash.update(pad2);
        this.oHash = hash2.create();
        for (let i2 = 0; i2 < pad2.length; i2++)
          pad2[i2] ^= 54 ^ 92;
        this.oHash.update(pad2);
        clean2(pad2);
      }
      update(buf) {
        aexists2(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        aexists2(this);
        abytes2(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    hmac = (hash2, key, message) => new HMAC(hash2, key).update(message).digest();
    hmac.create = (hash2, key) => new HMAC(hash2, key);
  }
});

// ../../node_modules/@noble/curves/esm/abstract/modular.js
function mod(a, b) {
  const result = a % b;
  return result >= _0n3 ? result : b + result;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n3) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n3)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n3)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n3, y2 = _1n3, u2 = _1n3, v = _0n3;
  while (a !== _0n3) {
    const q = b / a;
    const r2 = b % a;
    const m2 = x - u2 * q;
    const n = y2 - v * q;
    b = a, a = r2, x = u2, y2 = v, u2 = m2, v = n;
  }
  const gcd = b;
  if (gcd !== _1n3)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n3) / _4n;
  const root = Fp.pow(n, p1div4);
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n2);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i2 = Fp.mul(Fp.mul(nv, _2n2), v);
  const root = Fp.mul(nv, Fp.sub(i2, Fp.ONE));
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function tonelliShanks(P2) {
  if (P2 < BigInt(3))
    throw new Error("sqrt is not defined for small field");
  let Q = P2 - _1n3;
  let S = 0;
  while (Q % _2n2 === _0n3) {
    Q /= _2n2;
    S++;
  }
  let Z = _2n2;
  const _Fp = Field(P2);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n3) / _2n2;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M2 = S;
    let c2 = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R2 = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i2 = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i2++;
        t_tmp = Fp.sqr(t_tmp);
        if (i2 === M2)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n3 << BigInt(M2 - i2 - 1);
      const b = Fp.pow(c2, exponent);
      M2 = i2;
      c2 = Fp.sqr(b);
      t = Fp.mul(t, c2);
      R2 = Fp.mul(R2, b);
    }
    return R2;
  };
}
function FpSqrt(P2) {
  if (P2 % _4n === _3n)
    return sqrt3mod4;
  if (P2 % _8n === _5n)
    return sqrt5mod8;
  return tonelliShanks(P2);
}
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(Fp, num, power) {
  if (power < _0n3)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n3)
    return Fp.ONE;
  if (power === _1n3)
    return num;
  let p2 = Fp.ONE;
  let d2 = num;
  while (power > _0n3) {
    if (power & _1n3)
      p2 = Fp.mul(p2, d2);
    d2 = Fp.sqr(d2);
    power >>= _1n3;
  }
  return p2;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i2) => {
    if (Fp.is0(num))
      return acc;
    inverted[i2] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i2) => {
    if (Fp.is0(num))
      return acc;
    inverted[i2] = Fp.mul(acc, inverted[i2]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n3) / _2n2;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber2(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n3)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n3,
    ONE: _1n3,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n3 <= num && num < ORDER;
    },
    is0: (num) => num === _0n3,
    isOdd: (num) => (num & _1n3) === _1n3,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes) => {
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      return isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (lst) => FpInvertBatch(f, lst),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (a, b, c2) => c2 ? b : a
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n3) + _1n3;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
var _0n3, _1n3, _2n2, _3n, _4n, _5n, _8n, FIELD_FIELDS;
var init_modular = __esm({
  "../../node_modules/@noble/curves/esm/abstract/modular.js"() {
    init_utils2();
    init_utils3();
    _0n3 = BigInt(0);
    _1n3 = BigInt(1);
    _2n2 = /* @__PURE__ */ BigInt(2);
    _3n = /* @__PURE__ */ BigInt(3);
    _4n = /* @__PURE__ */ BigInt(4);
    _5n = /* @__PURE__ */ BigInt(5);
    _8n = /* @__PURE__ */ BigInt(8);
    FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
  }
});

// ../../node_modules/@noble/curves/esm/abstract/curve.js
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n4;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c2) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p2, i2) => {
    if (!(p2 instanceof c2))
      throw new Error("invalid point at index " + i2);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s2, i2) => {
    if (!field.isValid(s2))
      throw new Error("invalid scalar at index " + i2);
  });
}
function getW(P2) {
  return pointWindowSizes.get(P2) || 1;
}
function wNAF(c2, bits) {
  return {
    constTimeNegate,
    hasPrecomputes(elm) {
      return getW(elm) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(elm, n, p2 = c2.ZERO) {
      let d2 = elm;
      while (n > _0n4) {
        if (n & _1n4)
          p2 = p2.add(d2);
        d2 = d2.double();
        n >>= _1n4;
      }
      return p2;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const points = [];
      let p2 = elm;
      let base2 = p2;
      for (let window2 = 0; window2 < windows; window2++) {
        base2 = p2;
        points.push(base2);
        for (let i2 = 1; i2 < windowSize; i2++) {
          base2 = base2.add(p2);
          points.push(base2);
        }
        p2 = base2.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      let p2 = c2.ZERO;
      let f = c2.BASE;
      const wo = calcWOpts(W, bits);
      for (let window2 = 0; window2 < wo.windows; window2++) {
        const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
        n = nextN;
        if (isZero) {
          f = f.add(constTimeNegate(isNegF, precomputes[offsetF]));
        } else {
          p2 = p2.add(constTimeNegate(isNeg, precomputes[offset]));
        }
      }
      return { p: p2, f };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n, acc = c2.ZERO) {
      const wo = calcWOpts(W, bits);
      for (let window2 = 0; window2 < wo.windows; window2++) {
        if (n === _0n4)
          break;
        const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
        n = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      return acc;
    },
    getPrecomputes(W, P2, transform) {
      let comp = pointPrecomputes.get(P2);
      if (!comp) {
        comp = this.precomputeWindow(P2, W);
        if (W !== 1)
          pointPrecomputes.set(P2, transform(comp));
      }
      return comp;
    },
    wNAFCached(P2, n, transform) {
      const W = getW(P2);
      return this.wNAF(W, this.getPrecomputes(W, P2, transform), n);
    },
    wNAFCachedUnsafe(P2, n, transform, prev) {
      const W = getW(P2);
      if (W === 1)
        return this.unsafeLadder(P2, n, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, P2, transform), n, prev);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P2, W) {
      validateW(W, bits);
      pointWindowSizes.set(P2, W);
      pointPrecomputes.delete(P2);
    }
  };
}
function pippenger(c2, fieldN, points, scalars) {
  validateMSMPoints(points, c2);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c2.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i2 = lastBits; i2 >= 0; i2 -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < slength; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i2) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i2 !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
var _0n4, _1n4, pointPrecomputes, pointWindowSizes;
var init_curve = __esm({
  "../../node_modules/@noble/curves/esm/abstract/curve.js"() {
    init_modular();
    init_utils3();
    _0n4 = BigInt(0);
    _1n4 = BigInt(1);
    pointPrecomputes = /* @__PURE__ */ new WeakMap();
    pointWindowSizes = /* @__PURE__ */ new WeakMap();
  }
});

// ../../node_modules/@noble/curves/esm/abstract/weierstrass.js
function validateSigVerOpts(opts) {
  if (opts.lowS !== void 0)
    abool("lowS", opts.lowS);
  if (opts.prehash !== void 0)
    abool("prehash", opts.prehash);
}
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowInfinityPoint: "boolean",
    allowedPrivateKeyLengths: "array",
    clearCofactor: "function",
    fromBytes: "function",
    isTorsionFree: "function",
    toBytes: "function",
    wrapPrivateKey: "boolean"
  });
  const { endo, Fp, a } = opts;
  if (endo) {
    if (!Fp.eql(a, Fp.ZERO)) {
      throw new Error("invalid endo: CURVE.a must be 0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
    }
  }
  return Object.freeze({ ...opts });
}
function numToSizedHex(num, size2) {
  return bytesToHex2(numberToBytesBE(num, size2));
}
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp } = CURVE;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const toBytes3 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes3(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes) => {
    const tail = bytes.subarray(1);
    const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
    const y2 = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
    return { x, y: y2 };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
  }
  function isValidXY(x, y2) {
    const left = Fp.sqr(y2);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function isWithinCurveOrder(num) {
    return inRange(num, _1n5, CURVE.n);
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes3(key))
        key = bytesToHex2(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("invalid private key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
    }
    if (wrapPrivateKey)
      num = mod(num, N);
    aInRange("private key", num, _1n5, N);
    return num;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }
  const toAffineMemo = memoized((p2, iz) => {
    const { px: x, py: y2, pz: z } = p2;
    if (Fp.eql(z, Fp.ONE))
      return { x, y: y2 };
    const is0 = p2.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(z);
    const ax = Fp.mul(x, iz);
    const ay = Fp.mul(y2, iz);
    const zz = Fp.mul(z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p2) => {
    if (p2.is0()) {
      if (CURVE.allowInfinityPoint && !Fp.is0(p2.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y: y2 } = p2.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y2))
      throw new Error("bad point: x or y not FE");
    if (!isValidXY(x, y2))
      throw new Error("bad point: equation left != right");
    if (!p2.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  class Point {
    constructor(px, py, pz) {
      if (px == null || !Fp.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp.isValid(py) || Fp.is0(py))
        throw new Error("y required");
      if (pz == null || !Fp.isValid(pz))
        throw new Error("z required");
      this.px = px;
      this.py = py;
      this.pz = pz;
      Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p2) {
      const { x, y: y2 } = p2 || {};
      if (!p2 || !Fp.isValid(x) || !Fp.isValid(y2))
        throw new Error("invalid affine point");
      if (p2 instanceof Point)
        throw new Error("projective point not allowed");
      const is0 = (i2) => Fp.eql(i2, Fp.ZERO);
      if (is0(x) && is0(y2))
        return Point.ZERO;
      return new Point(x, y2, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = FpInvertBatch(Fp, points.map((p2) => p2.pz));
      return points.map((p2, i2) => p2.toAffine(toInv[i2])).map(Point.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P2 = Point.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
      P2.assertValidity();
      return P2;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y: y2 } = this.toAffine();
      if (Fp.isOdd)
        return !Fp.isOdd(y2);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      aprjpoint(other);
      const { px: X12, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X12, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point(this.px, Fp.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { px: X12, py: Y1, pz: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X12, X12);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X12, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X12, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { px: X12, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X12, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X12, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X12, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2, n: N } = CURVE;
      aInRange("scalar", sc, _0n5, N);
      const I = Point.ZERO;
      if (sc === _0n5)
        return I;
      if (this.is0() || sc === _1n5)
        return this;
      if (!endo2 || wnaf.hasPrecomputes(this))
        return wnaf.wNAFCachedUnsafe(this, sc, Point.normalizeZ);
      let { k1neg, k1, k2neg, k2 } = endo2.splitScalar(sc);
      let k1p = I;
      let k2p = I;
      let d2 = this;
      while (k1 > _0n5 || k2 > _0n5) {
        if (k1 & _1n5)
          k1p = k1p.add(d2);
        if (k2 & _1n5)
          k2p = k2p.add(d2);
        d2 = d2.double();
        k1 >>= _1n5;
        k2 >>= _1n5;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2, n: N } = CURVE;
      aInRange("scalar", scalar, _1n5, N);
      let point, fake;
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = endo2.splitScalar(scalar);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p: p2, f } = this.wNAF(scalar);
        point = p2;
        fake = f;
      }
      return Point.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point.BASE;
      const mul = (P2, a2) => a2 === _0n5 || a2 === _1n5 || !P2.equals(G) ? P2.multiplyUnsafe(a2) : P2.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n5)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n5)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool("isCompressed", isCompressed);
      this.assertValidity();
      return toBytes3(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool("isCompressed", isCompressed);
      return bytesToHex2(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
  const { endo, nBitLength } = CURVE;
  const wnaf = wNAF(Point, endo ? Math.ceil(nBitLength / 2) : nBitLength);
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp, n: CURVE_ORDER, nByteLength, nBitLength } = CURVE;
  const compressedLen = Fp.BYTES + 1;
  const uncompressedLen = 2 * Fp.BYTES + 1;
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp.toBytes(a.x);
      const cat = concatBytes3;
      abool("isCompressed", isCompressed);
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
      }
    },
    fromBytes(bytes) {
      const len = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!inRange(x, _1n5, Fp.ORDER))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y3;
        try {
          y3 = Fp.sqrt(y2);
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("Point is not on curve" + suffix);
        }
        const isYOdd = (y3 & _1n5) === _1n5;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y3 = Fp.neg(y3);
        return { x, y: y3 };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y2 = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y: y2 };
      } else {
        const cl = compressedLen;
        const ul = uncompressedLen;
        throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
      }
    }
  });
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n5;
    return number > HALF;
  }
  function normalizeS(s2) {
    return isBiggerThanHalfOrder(s2) ? modN(-s2) : s2;
  }
  const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
  class Signature {
    constructor(r2, s2, recovery) {
      aInRange("r", r2, _1n5, CURVE_ORDER);
      aInRange("s", s2, _1n5, CURVE_ORDER);
      this.r = r2;
      this.s = s2;
      if (recovery != null)
        this.recovery = recovery;
      Object.freeze(this);
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const l = nByteLength;
      hex = ensureBytes("compactSignature", hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const { r: r2, s: s2 } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r2, s2);
    }
    /**
     * @todo remove
     * @deprecated
     */
    assertValidity() {
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r: r2, s: s2, recovery: rec } = this;
      const h2 = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r2 + CURVE.n : r2;
      if (radj >= Fp.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R2 = Point.fromHex(prefix + numToSizedHex(radj, Fp.BYTES));
      const ir = invN(radj);
      const u12 = modN(-h2 * ir);
      const u2 = modN(s2 * ir);
      const Q = Point.BASE.multiplyAndAddUnsafe(R2, u12, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes2(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig(this);
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes2(this.toCompactHex());
    }
    toCompactHex() {
      const l = nByteLength;
      return numToSizedHex(this.r, l) + numToSizedHex(this.s, l);
    }
  }
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    if (typeof item === "bigint")
      return false;
    if (item instanceof Point)
      return true;
    const arr = ensureBytes("key", item);
    const len = arr.length;
    const fpl = Fp.BYTES;
    const compLen = fpl + 1;
    const uncompLen = 2 * fpl + 1;
    if (CURVE.allowedPrivateKeyLengths || nByteLength === compLen) {
      return void 0;
    } else {
      return len === compLen || len === uncompLen;
    }
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicB) === false)
      throw new Error("second arg must be public key");
    const b = Point.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
    return modN(bits2int(bytes));
  };
  const ORDER_MASK = bitMask(nBitLength);
  function int2octets(num) {
    aInRange("num < 2^" + nBitLength, num, _0n5, ORDER_MASK);
    return numberToBytesBE(num, nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { hash: hash2, randomBytes: randomBytes2 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    validateSigVerOpts(opts);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d2 = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d2), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e2 = ent === true ? randomBytes2(Fp.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e2));
    }
    const seed = concatBytes3(...seedArgs);
    const m2 = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r2 = modN(q.x);
      if (r2 === _0n5)
        return;
      const s2 = modN(ik * modN(m2 + r2 * d2));
      if (s2 === _0n5)
        return;
      let recovery = (q.x === r2 ? 0 : 2) | Number(q.y & _1n5);
      let normS = s2;
      if (lowS && isBiggerThanHalfOrder(s2)) {
        normS = normalizeS(s2);
        recovery ^= 1;
      }
      return new Signature(r2, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign2(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C2 = CURVE;
    const drbg = createHmacDrbg(C2.hash.outputLen, C2.nByteLength, C2.hmac);
    return drbg(seed, k2sig);
  }
  Point.BASE._setWindowSize(8);
  function verify2(signature, msgHash, publicKey2, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey2 = ensureBytes("publicKey", publicKey2);
    const { lowS, prehash, format: format2 } = opts;
    validateSigVerOpts(opts);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    if (format2 !== void 0 && format2 !== "compact" && format2 !== "der")
      throw new Error("format must be compact or der");
    const isHex2 = typeof sg === "string" || isBytes3(sg);
    const isObj2 = !isHex2 && !format2 && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
    if (!isHex2 && !isObj2)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    let _sig = void 0;
    let P2;
    try {
      if (isObj2)
        _sig = new Signature(sg.r, sg.s);
      if (isHex2) {
        try {
          if (format2 !== "compact")
            _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
        }
        if (!_sig && format2 !== "der")
          _sig = Signature.fromCompact(sg);
      }
      P2 = Point.fromHex(publicKey2);
    } catch (error) {
      return false;
    }
    if (!_sig)
      return false;
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r: r2, s: s2 } = _sig;
    const h2 = bits2int_modN(msgHash);
    const is = invN(s2);
    const u12 = modN(h2 * is);
    const u2 = modN(r2 * is);
    const R2 = Point.BASE.multiplyAndAddUnsafe(P2, u12, u2)?.toAffine();
    if (!R2)
      return false;
    const v = modN(R2.x);
    return v === r2;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign: sign2,
    verify: verify2,
    ProjectivePoint: Point,
    Signature,
    utils
  };
}
var DERErr, DER, _0n5, _1n5, _2n3, _3n2, _4n2;
var init_weierstrass = __esm({
  "../../node_modules/@noble/curves/esm/abstract/weierstrass.js"() {
    init_curve();
    init_modular();
    init_utils3();
    DERErr = class extends Error {
      constructor(m2 = "") {
        super(m2);
      }
    };
    DER = {
      // asn.1 DER encoding utils
      Err: DERErr,
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E2 } = DER;
          if (tag < 0 || tag > 256)
            throw new E2("tlv.encode: wrong tag");
          if (data.length & 1)
            throw new E2("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E2("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
          const t = numberToHexUnpadded(tag);
          return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E2 } = DER;
          let pos = 0;
          if (tag < 0 || tag > 256)
            throw new E2("tlv.encode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E2("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E2("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E2("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E2("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E2("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length = length << 8 | b;
            pos += lenLen;
            if (length < 128)
              throw new E2("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E2("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num) {
          const { Err: E2 } = DER;
          if (num < _0n5)
            throw new E2("integer: negative integers are not allowed");
          let hex = numberToHexUnpadded(num);
          if (Number.parseInt(hex[0], 16) & 8)
            hex = "00" + hex;
          if (hex.length & 1)
            throw new E2("unexpected DER parsing assertion: unpadded hex");
          return hex;
        },
        decode(data) {
          const { Err: E2 } = DER;
          if (data[0] & 128)
            throw new E2("invalid signature integer: negative");
          if (data[0] === 0 && !(data[1] & 128))
            throw new E2("invalid signature integer: unnecessary leading zero");
          return bytesToNumberBE(data);
        }
      },
      toSig(hex) {
        const { Err: E2, _int: int, _tlv: tlv } = DER;
        const data = ensureBytes("signature", hex);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E2("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E2("invalid signature: left bytes after parsing");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = DER;
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    _0n5 = BigInt(0);
    _1n5 = BigInt(1);
    _2n3 = BigInt(2);
    _3n2 = BigInt(3);
    _4n2 = BigInt(4);
  }
});

// ../../node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash2) {
  return {
    hash: hash2,
    hmac: (key, ...msgs) => hmac(hash2, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create = (hash2) => weierstrass({ ...curveDef, ...getHash(hash2) });
  return { ...create(defHash), create };
}
var init_shortw_utils = __esm({
  "../../node_modules/@noble/curves/esm/_shortw_utils.js"() {
    init_hmac();
    init_utils2();
    init_weierstrass();
  }
});

// ../../node_modules/@noble/curves/esm/secp256k1.js
function sqrtMod(y2) {
  const P2 = secp256k1P;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y2 * y2 * y2 % P2;
  const b3 = b2 * b2 * y2 % P2;
  const b6 = pow2(b3, _3n3, P2) * b3 % P2;
  const b9 = pow2(b6, _3n3, P2) * b3 % P2;
  const b11 = pow2(b9, _2n4, P2) * b2 % P2;
  const b22 = pow2(b11, _11n, P2) * b11 % P2;
  const b44 = pow2(b22, _22n, P2) * b22 % P2;
  const b88 = pow2(b44, _44n, P2) * b44 % P2;
  const b176 = pow2(b88, _88n, P2) * b88 % P2;
  const b220 = pow2(b176, _44n, P2) * b44 % P2;
  const b223 = pow2(b220, _3n3, P2) * b3 % P2;
  const t1 = pow2(b223, _23n, P2) * b22 % P2;
  const t2 = pow2(t1, _6n, P2) * b2 % P2;
  const root = pow2(t2, _2n4, P2);
  if (!Fpk1.eql(Fpk1.sqr(root), y2))
    throw new Error("Cannot find square root");
  return root;
}
var secp256k1P, secp256k1N, _0n6, _1n6, _2n4, divNearest, Fpk1, secp256k1;
var init_secp256k1 = __esm({
  "../../node_modules/@noble/curves/esm/secp256k1.js"() {
    init_sha2();
    init_shortw_utils();
    init_modular();
    secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
    secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
    _0n6 = BigInt(0);
    _1n6 = BigInt(1);
    _2n4 = BigInt(2);
    divNearest = (a, b) => (a + b / _2n4) / b;
    Fpk1 = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
    secp256k1 = createCurve({
      a: _0n6,
      b: BigInt(7),
      Fp: Fpk1,
      n: secp256k1N,
      Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
      Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
      h: BigInt(1),
      lowS: true,
      // Allow only low-S signatures by default in sign() and verify()
      endo: {
        // Endomorphism, see above
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        splitScalar: (k) => {
          const n = secp256k1N;
          const a12 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
          const b1 = -_1n6 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
          const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
          const b2 = a12;
          const POW_2_128 = BigInt("0x100000000000000000000000000000000");
          const c12 = divNearest(b2 * k, n);
          const c2 = divNearest(-b1 * k, n);
          let k1 = mod(k - c12 * a12 - c2 * a2, n);
          let k2 = mod(-c12 * b1 - c2 * b2, n);
          const k1neg = k1 > POW_2_128;
          const k2neg = k2 > POW_2_128;
          if (k1neg)
            k1 = n - k1;
          if (k2neg)
            k2 = n - k2;
          if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error("splitScalar: Endomorphism failed, k=" + k);
          }
          return { k1neg, k1, k2neg, k2 };
        }
      }
    }, sha2562);
  }
});

// src/main.ts
import { createInterface } from "node:readline/promises";

// src/cli.ts
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname as dirname4, join as join4, resolve as resolve3 } from "node:path";

// src/api.ts
var DEFAULT_API = "https://api.doubleagent.so";
var DEFAULT_PORTAL = "https://app.doubleagent.so";
var ApiError = class extends Error {
  constructor(status, code, message, body, headers) {
    super(message);
    this.status = status;
    this.code = code;
    this.body = body;
    this.headers = headers;
    this.name = "ApiError";
  }
};
function createApi(base2, session, f = fetch) {
  const root = base2.replace(/\/+$/, "");
  return {
    base: root,
    async request(method, path, body, headers = {}) {
      let res;
      try {
        res = await f(`${root}${path}`, {
          method,
          headers: {
            accept: "application/json",
            ...body !== void 0 ? { "content-type": "application/json" } : {},
            ...session ? { authorization: `Bearer ${session}` } : {},
            "user-agent": "doubleagent-cli",
            ...headers
          },
          body: body !== void 0 ? JSON.stringify(body) : void 0
        });
      } catch (e2) {
        throw new ApiError(0, "network", `cannot reach ${root}: ${e2.message}`);
      }
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) {
        const err = data?.error;
        const code = typeof err === "string" ? err : err?.code ?? `http_${res.status}`;
        const message = typeof err === "object" && err?.message || `${method} ${path} \u2192 ${res.status}${typeof err === "string" ? ` ${err}` : ""}`;
        throw new ApiError(res.status, code, message, data, res.headers);
      }
      return { status: res.status, data, headers: res.headers };
    }
  };
}

// src/config.ts
import { chmodSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
function configDir(env) {
  return env.DOUBLEAGENT_CONFIG_DIR ?? join(env.XDG_CONFIG_HOME || join(env.HOME || homedir(), ".config"), "doubleagent");
}
var credentialsPath = (env) => join(configDir(env), "credentials.json");
function loadCredentials(env) {
  try {
    const c2 = JSON.parse(readFileSync(credentialsPath(env), "utf8"));
    return typeof c2.session === "string" && typeof c2.api === "string" ? c2 : null;
  } catch {
    return null;
  }
}
function saveCredentials(env, c2) {
  const dir = configDir(env);
  mkdirSync(dir, { recursive: true, mode: 448 });
  const path = credentialsPath(env);
  writeFileSync(path, `${JSON.stringify(c2, null, 2)}
`, { mode: 384 });
  chmodSync(path, 384);
  return path;
}
function deleteCredentials(env) {
  rmSync(credentialsPath(env), { force: true });
}

// src/io.ts
var CliError = class extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
    this.name = "CliError";
  }
};
var str = (v) => typeof v === "string" ? v : void 0;
var apiBase = (args, io, creds) => (str(args.flags.api) ?? io.env.DOUBLEAGENT_API ?? creds?.api ?? DEFAULT_API).replace(/\/+$/, "");
var portalBase = (args, io) => (str(args.flags.portal) ?? io.env.DOUBLEAGENT_PORTAL ?? DEFAULT_PORTAL).replace(/\/+$/, "");
var anonApi = (args, io) => createApi(apiBase(args, io, loadCredentials(io.env)), void 0, io.fetch);
function sessionApi(args, io) {
  const creds = loadCredentials(io.env);
  const session = io.env.DOUBLEAGENT_SESSION ?? creds?.session;
  if (!session) throw new CliError("not logged in: run `npx @doubleagent-so/cli login` first (or set DOUBLEAGENT_SESSION)");
  const c2 = creds ?? { api: apiBase(args, io), session, saved_at: "" };
  return { api: createApi(apiBase(args, io, creds), session, io.fetch), creds: c2 };
}
var json = (io, v) => io.out(JSON.stringify(v, null, 2));

// src/pow.ts
import { createHash } from "node:crypto";
var MAX_D = 32;
function difficultyFrom(body) {
  const d2 = body?.error?.difficulty;
  return typeof d2 === "number" && Number.isInteger(d2) ? d2 : null;
}
var leadingZeroBits = (h2) => {
  let bits = 0;
  for (const byte of h2) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    return bits + Math.clz32(byte) - 24;
  }
  return bits;
};
function solve(prefix, d2) {
  if (d2 > MAX_D) throw new Error(`proof-of-work difficulty ${d2} is too high`);
  for (let n = 0; ; n++) {
    if (leadingZeroBits(createHash("sha256").update(prefix + n).digest()) >= d2) return String(n);
  }
}

// src/account.ts
var sleep = (io, ms) => io.sleep ? io.sleep(ms) : new Promise((r2) => setTimeout(r2, ms));
async function login(args, io) {
  const api = anonApi(args, io);
  const { data: d2 } = await api.request("POST", "/v1/auth/device", {});
  if (!d2?.device_code || !d2.user_code || !d2.verify_url) throw new CliError("unexpected /v1/auth/device response");
  const asJson = !!args.flags.json;
  const msg = `Open ${d2.verify_url} and confirm the code ${d2.user_code}`;
  if (asJson) io.err(JSON.stringify({ verify_url: d2.verify_url, user_code: d2.user_code }));
  else io.out(`${msg}
Waiting for approval\u2026`);
  let interval = Math.max(1, d2.interval ?? 5) * 1e3;
  const deadline = Date.now() + (d2.expires_in ?? 600) * 1e3;
  while (Date.now() < deadline) {
    await sleep(io, interval);
    try {
      const { data } = await api.request("POST", "/v1/auth/device/token", { device_code: d2.device_code });
      if (!data?.session) throw new CliError("unexpected /v1/auth/device/token response");
      const email = data.user?.email ?? await whoami(api.base, data.session, io);
      const path = saveCredentials(io.env, { api: api.base, session: data.session, email, saved_at: (/* @__PURE__ */ new Date()).toISOString() });
      if (asJson) json(io, { ok: true, email: email ?? null, credentials: path });
      else io.out(`Logged in${email ? ` as ${email}` : ""}. Session saved to ${path}`);
      return 0;
    } catch (e2) {
      if (!(e2 instanceof ApiError)) throw e2;
      if (e2.status === 428 || e2.code === "authorization_pending") continue;
      if (e2.status === 429 || e2.code === "slow_down") {
        interval += 5e3;
        continue;
      }
      if (e2.status === 410 || e2.code === "expired") throw new CliError("the code expired before it was approved; run `npx @doubleagent-so/cli login` again");
      throw e2;
    }
  }
  throw new CliError("timed out waiting for approval");
}
async function whoami(base2, session, io) {
  try {
    return (await createApi(base2, session, io.fetch).request("GET", "/v1/me")).data?.user?.email;
  } catch {
    return void 0;
  }
}
async function logout(args, io) {
  const creds = loadCredentials(io.env);
  if (creds) {
    try {
      await sessionApi(args, io).api.request("POST", "/v1/auth/logout", { all: !!args.flags.all });
    } catch {
    }
  }
  deleteCredentials(io.env);
  if (args.flags.json) json(io, { ok: true });
  else io.out(creds ? "Logged out." : "Not logged in.");
  return 0;
}
var hostOf = (d2) => typeof d2 === "string" ? d2 : d2.hostname;
async function sites(args, io) {
  const { api } = sessionApi(args, io);
  const { data: me } = await api.request("GET", "/v1/me");
  if (args.flags.json) {
    json(io, me);
    return 0;
  }
  const accounts = me?.accounts ?? [];
  if (!accounts.length) io.out("No accounts yet. Create one with `npx @doubleagent-so/cli init --email you@example.com`.");
  for (const a of accounts) {
    io.out(`${a.name ?? a.id} (${a.id}${a.role ? `, ${a.role}` : ""})`);
    const list = a.sites ?? [];
    if (!list.length) io.out("  (no sites)");
    for (const s2 of list) io.out(`  ${s2.id}  ${(s2.status ?? "?").padEnd(10)}  ${s2.name ?? ""}  ${(s2.domains ?? []).map(hostOf).join(", ")}`);
  }
  return 0;
}
async function resolveSite(args, api) {
  const flag = str(args.flags.site);
  if (flag) return flag;
  const { data: me } = await api.request("GET", "/v1/me");
  const all = (me?.accounts ?? []).flatMap((a) => a.sites ?? []);
  if (all.length === 1) return all[0].id;
  if (!all.length) throw new CliError("no sites: create one with `npx @doubleagent-so/cli init --email you@example.com`");
  throw new CliError(`several sites: pass --site (${all.map((s2) => s2.id).join(", ")})`);
}
var rowsOf = (d2) => Array.isArray(d2) ? d2 : d2?.keys ?? [];
var keyRowOf = (r2) => {
  const { key, ...flat } = r2 ?? {};
  return key && typeof key === "object" ? { ...key, ...flat } : { ...flat, ...typeof key === "string" ? { key } : {} };
};
var secretOf = (k) => k.secret ?? (k.key?.startsWith("sk_") ? k.key : void 0);
var when = (t) => typeof t === "number" ? new Date(t * 1e3).toISOString() : t;
function printKey(io, k) {
  const state = k.revoked_at ? "revoked" : k.expires_at ? `expires ${when(k.expires_at)}` : "active";
  io.out(`  ${k.id}  ${k.kind ?? "?"}_${k.env ?? "?"}  ${k.public_key ?? k.prefix ?? ""}  ${state}${k.last_used_at ? `  last used ${when(k.last_used_at)}` : ""}`);
}
function showSecret(io, k) {
  const s2 = secretOf(k);
  if (!s2) return;
  io.out(`
Secret key (shown once, store it server-side only, never in client code):
  ${s2}`);
}
async function keys(args, io) {
  const { api } = sessionApi(args, io);
  const site = await resolveSite(args, api);
  const sub = args.pos[0] ?? "list";
  const base2 = `/v1/sites/${encodeURIComponent(site)}/keys`;
  const needId = () => {
    const id = args.pos[1];
    if (!id) throw new CliError(`usage: npx @doubleagent-so/cli keys ${sub} <key_id> [--site st_\u2026]`);
    return encodeURIComponent(id);
  };
  let result;
  switch (sub) {
    case "list":
      result = (await api.request("GET", base2)).data;
      break;
    case "create": {
      const kind = str(args.flags.kind) ?? "pk";
      const env = str(args.flags.env) ?? "live";
      if (!["pk", "sk"].includes(kind) || !["live", "test"].includes(env)) throw new CliError("--kind must be pk|sk and --env live|test");
      result = (await api.request("POST", base2, { kind, env })).data;
      break;
    }
    case "rotate":
      result = (await api.request("POST", `${base2}/${needId()}/rotate`, {})).data;
      break;
    case "revoke":
      result = (await api.request("DELETE", `${base2}/${needId()}`)).data ?? { revoked: args.pos[1] };
      break;
    default:
      throw new CliError(`unknown keys command "${sub}" (list|create|rotate|revoke)`);
  }
  if (args.flags.json) {
    json(io, { site, ...typeof result === "object" && result && !Array.isArray(result) ? result : { keys: result } });
    return 0;
  }
  if (sub === "list") {
    io.out(`Keys for ${site}:`);
    rowsOf(result).forEach((k) => printKey(io, k));
  } else if (sub === "revoke") {
    io.out(`Revoked ${args.pos[1]}.`);
  } else {
    const k = keyRowOf(result);
    io.out(sub === "rotate" ? "Rotated. The old key keeps working for 24 h." : "Created:");
    printKey(io, k);
    showSecret(io, k);
  }
  return 0;
}
var METHODS = ["dns", "meta", "file", "script"];
function howTo(method, host, info) {
  const i2 = info.instructions;
  if (method === "dns" && i2?.dns?.name && i2.dns.value) return `Add a DNS ${i2.dns.type ?? "TXT"} record: ${i2.dns.name}  "${i2.dns.value}"`;
  if (method === "meta" && i2?.meta?.html) return `Add to the <head> of https://${host}/: ${i2.meta.html}`;
  if (method === "file" && i2?.file?.url && i2.file.body) return `Serve ${i2.file.url} containing: ${i2.file.body}`;
  if (method === "script" && i2?.script?.html) return `Deploy this tag on https://${host}/: ${i2.script.html}`;
  return info.token ? instructions(method, host, info.token) : void 0;
}
function instructions(method, host, token) {
  switch (method) {
    case "dns":
      return `Add a DNS TXT record: _doubleagent.${host}  "da-verify=${token}"  (an apex record also covers subdomains)`;
    case "meta":
      return `Add to the <head> of https://${host}/: <meta name="doubleagent-verification" content="${token}">`;
    case "file":
      return `Serve https://${host}/.well-known/doubleagent.txt containing: da-verify=${token}`;
    case "script":
      return `Deploy the SDK tag with this site's public key (data-key) on https://${host}/`;
  }
}
async function verifyDomain(args, io) {
  const host = args.pos[0]?.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!host || !/^[a-z0-9.-]+(:\d+)?$/.test(host)) throw new CliError("usage: npx @doubleagent-so/cli verify-domain <host> --method dns|meta|file|script [--site st_\u2026]");
  const method = str(args.flags.method) ?? "dns";
  if (!METHODS.includes(method)) throw new CliError(`--method must be one of ${METHODS.join("|")}`);
  const { api } = sessionApi(args, io);
  const site = await resolveSite(args, api);
  const path = `/v1/sites/${encodeURIComponent(site)}/domains`;
  let info = {};
  try {
    info = (await api.request("POST", path, { hostname: host })).data ?? {};
  } catch (e2) {
    if (!(e2 instanceof ApiError) || e2.status !== 409) throw e2;
    info = e2.body?.domain ?? e2.body ?? {};
  }
  const { data: r2 } = await api.request("POST", `${path}/${encodeURIComponent(host)}/verify`, { method });
  const how = howTo(method, host, info);
  if (args.flags.json) {
    json(io, { site, hostname: host, method, verified: !!r2?.verified, detail: r2?.detail ?? null, claimed: r2?.claimed ?? null, token: info.token ?? null, instructions: how ?? info.instructions ?? null });
    return r2?.verified ? 0 : 1;
  }
  if (r2?.verified) {
    io.out(`Verified ${host} (${method}).`);
    if (r2.claimed?.sessions) io.out(`Claimed ${r2.claimed.sessions} session(s) collected before you joined.`);
    return 0;
  }
  io.out(`Not verified yet${r2?.detail ? `: ${r2.detail}` : ""}.`);
  if (how) io.out(how);
  io.out(`Then run: npx @doubleagent-so/cli verify-domain ${host} --method ${method}${args.flags.site ? ` --site ${site}` : ""}`);
  return 1;
}
var ACCOUNT_POW_BITS = 18;
async function createAccount(args, io, body) {
  const api = anonApi(args, io);
  const attempt = (bits) => {
    const ts = String(Math.floor(Date.now() / 1e3));
    const solution = solve(accountPowPrefix(body.email, ts), bits);
    return api.request("POST", "/v1/accounts", body, { "DA-PoW": `${ts}:${solution}` });
  };
  try {
    return (await attempt(ACCOUNT_POW_BITS)).data;
  } catch (e2) {
    if (!(e2 instanceof ApiError) || !(e2.status === 428 || e2.code === "pow_required")) throw e2;
    const d2 = difficultyFrom(e2.body);
    if (d2 === null) throw new CliError("the API rejected the proof of work and sent no difficulty");
    return (await attempt(d2)).data;
  }
}
var accountPowPrefix = (email, ts) => `da-accounts|${email.trim().toLowerCase()}|${ts}|`;

// src/analytics.ts
var RULES = [
  { name: "ga4", deps: ["react-ga4", "vue-gtag", "@next/third-parties", "nuxt-gtag"], source: /gtag\/js\?id=G-|gtag\(\s*['"]config['"]\s*,\s*['"]G-|<GoogleAnalytics\b/ },
  { name: "gtm", deps: ["react-gtm-module", "@gtm-support/vue-gtm"], source: /googletagmanager\.com\/gtm\.js|['"]GTM-[A-Z0-9]+['"]|<GoogleTagManager\b/ },
  { name: "gads", source: /gtag\/js\?id=AW-|['"]AW-\d+|googleadservices\.com/ },
  { name: "meta", deps: ["react-facebook-pixel", "react-meta-pixel"], source: /connect\.facebook\.net\/[^'"]*fbevents\.js|\bfbq\(\s*['"](init|track)/ },
  { name: "tiktok", source: /analytics\.tiktok\.com|\bttq\.(load|page|track)\(/ },
  { name: "klaviyo", deps: ["klaviyo-sdk"], source: /static\.klaviyo\.com|klaviyo\.js|_learnq/ },
  { name: "mixpanel", deps: ["mixpanel-browser"], source: /cdn\.mxpnl\.com|mixpanel\.init\(/ },
  { name: "segment", deps: ["@segment/analytics-next", "@segment/snippet"], source: /cdn\.segment\.com\/analytics\.js/ },
  { name: "posthog", deps: ["posthog-js"], source: /posthog\.init\(|[a-z]+\.posthog\.com\/static\/array\.js/ },
  { name: "amplitude", deps: ["@amplitude/analytics-browser", "@amplitude/unified", "amplitude-js"], source: /cdn\.amplitude\.com/ },
  { name: "hubspot", source: /js\.hs-scripts\.com|js\.hs-analytics\.net|_hsq/ },
  { name: "intercom", deps: ["@intercom/messenger-js-sdk", "react-use-intercom"], source: /widget\.intercom\.io|\bIntercom\(\s*['"]boot/ },
  { name: "clarity", deps: ["@microsoft/clarity"], source: /clarity\.ms\/tag/ },
  { name: "hotjar", deps: ["@hotjar/browser", "react-hotjar"], source: /static\.hotjar\.com|\bhj\(\s*['"]/ },
  { name: "stripe", deps: ["@stripe/stripe-js", "@stripe/react-stripe-js"], source: /js\.stripe\.com\/v3/ },
  { name: "mailchimp", source: /list-manage\.com\/subscribe/ }
];
function detectIntegrations(p2, extraSources = {}) {
  const found = /* @__PURE__ */ new Map();
  for (const r2 of RULES) {
    const dep = r2.deps?.find((d2) => p2.dep(d2));
    if (dep) found.set(r2.name, `dependency ${dep}`);
  }
  const sources = Object.entries(extraSources);
  for (const f of p2.files()) {
    const txt = p2.read(f);
    if (txt) sources.push([f, txt]);
  }
  for (const [file, txt] of sources) {
    for (const r2 of RULES) {
      if (!found.has(r2.name) && r2.source?.test(txt)) found.set(r2.name, file);
    }
  }
  if (p2.has("layout/theme.liquid")) found.set("shopify", "layout/theme.liquid");
  return RULES.map((r2) => r2.name).concat("shopify").filter((n, i2, a) => a.indexOf(n) === i2 && found.has(n)).map((name) => ({ name, evidence: found.get(name) }));
}
function detectInHtml(html) {
  const out = RULES.filter((r2) => r2.source?.test(html)).map((r2) => r2.name);
  if (/cdn\.shopify\.com|Shopify\.theme/.test(html)) out.push("shopify");
  return out;
}

// src/detect.ts
var LABELS = {
  "next-app": "Next.js (app router)",
  "next-pages": "Next.js (pages router)",
  nuxt: "Nuxt",
  sveltekit: "SvelteKit",
  astro: "Astro",
  remix: "Remix / React Router",
  vite: "Vite",
  html: "Static HTML",
  "shopify-theme": "Shopify theme",
  "wordpress-theme": "WordPress theme",
  unknown: "Unknown"
};
var SRC_EXT = ["tsx", "jsx", "ts", "js"];
var withExt = (base2) => SRC_EXT.map((e2) => `${base2}.${e2}`);
var nextAppLayout = (p2) => p2.first(...withExt("app/layout"), ...withExt("src/app/layout"));
var nextDocumentPath = (p2) => p2.first(...withExt("pages/_document"), ...withExt("src/pages/_document"));
function detectId(p2) {
  if (p2.has("layout/theme.liquid")) return "shopify-theme";
  if (p2.has("header.php") || /Theme Name:/i.test(p2.read("style.css") ?? "")) return "wordpress-theme";
  if (p2.dep("next")) {
    if (nextAppLayout(p2)) return "next-app";
    return "next-pages";
  }
  if (p2.dep("nuxt") || p2.first("nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs")) return "nuxt";
  if (p2.dep("@sveltejs/kit")) return "sveltekit";
  if (p2.dep("astro") || p2.first("astro.config.mjs", "astro.config.ts", "astro.config.js")) return "astro";
  if ((p2.dep("@remix-run/react") || p2.dep("@react-router/dev")) && p2.first(...withExt("app/root"))) return "remix";
  if (p2.dep("vite") && p2.has("index.html")) return "vite";
  if (p2.has("index.html") || p2.has("public/index.html") || p2.files().some((f) => !f.includes("/") && /\.html?$/i.test(f))) return "html";
  return "unknown";
}
function detectPlatform(p2) {
  if (p2.dep("lovable-tagger")) return "lovable";
  if (p2.has(".bolt")) return "bolt";
  const readme = p2.read("README.md") ?? "";
  if (/lovable\.(dev|app)/i.test(readme)) return "lovable";
  if (/\bv0\.(dev|app)\b/i.test(readme)) return "v0";
  return void 0;
}
function detectStack(p2) {
  const id = detectId(p2);
  return { id, label: LABELS[id], platform: detectPlatform(p2) };
}

// src/diff.ts
function unifiedDiff(path, before, after, context = 3) {
  const a = before === null ? [] : splitLines(before);
  const b = splitLines(after);
  const ops = diffLines(a, b);
  const hunks = [];
  let i2 = 0;
  while (i2 < ops.length) {
    if (ops[i2].t === " ") {
      i2++;
      continue;
    }
    let start = Math.max(0, i2 - context);
    let end = i2;
    while (end < ops.length) {
      if (ops[end].t !== " ") {
        end++;
        continue;
      }
      let run2 = 0;
      while (end + run2 < ops.length && ops[end + run2].t === " ") run2++;
      if (end + run2 >= ops.length || run2 > context * 2) {
        end = Math.min(ops.length, end + context);
        break;
      }
      end += run2;
    }
    const slice2 = ops.slice(start, end);
    const aStart = ops[start].ai, bStart = ops[start].bi;
    const aLen = slice2.filter((o) => o.t !== "+").length;
    const bLen = slice2.filter((o) => o.t !== "-").length;
    hunks.push(`@@ -${aLen ? aStart + 1 : aStart},${aLen} +${bLen ? bStart + 1 : bStart},${bLen} @@`);
    for (const o of slice2) hunks.push(`${o.t}${o.line}`);
    i2 = end;
    start = end;
  }
  const from = before === null ? "/dev/null" : `a/${path}`;
  return [`--- ${from}`, `+++ b/${path}`, ...hunks].join("\n");
}
var splitLines = (s2) => {
  const lines = s2.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
};
function diffLines(a, b) {
  let pre = 0;
  while (pre < a.length && pre < b.length && a[pre] === b[pre]) pre++;
  let suf = 0;
  while (suf < a.length - pre && suf < b.length - pre && a[a.length - 1 - suf] === b[b.length - 1 - suf]) suf++;
  const am = a.slice(pre, a.length - suf), bm = b.slice(pre, b.length - suf);
  const n = am.length, m2 = bm.length;
  const L = Array.from({ length: n + 1 }, () => new Array(m2 + 1).fill(0));
  for (let x2 = n - 1; x2 >= 0; x2--) for (let y3 = m2 - 1; y3 >= 0; y3--) L[x2][y3] = am[x2] === bm[y3] ? L[x2 + 1][y3 + 1] + 1 : Math.max(L[x2 + 1][y3], L[x2][y3 + 1]);
  const ops = [];
  for (let k = 0; k < pre; k++) ops.push({ t: " ", line: a[k], ai: k, bi: k });
  let x = 0, y2 = 0;
  while (x < n || y2 < m2) {
    if (x < n && y2 < m2 && am[x] === bm[y2]) {
      ops.push({ t: " ", line: am[x], ai: pre + x, bi: pre + y2 });
      x++;
      y2++;
    } else if (y2 < m2 && (x >= n || L[x][y2 + 1] >= L[x + 1][y2])) {
      ops.push({ t: "+", line: bm[y2], ai: pre + x, bi: pre + y2 });
      y2++;
    } else {
      ops.push({ t: "-", line: am[x], ai: pre + x, bi: pre + y2 });
      x++;
    }
  }
  for (let k = suf; k > 0; k--) ops.push({ t: " ", line: a[a.length - k], ai: a.length - k, bi: b.length - k });
  return ops;
}

// src/edit.ts
var lineStart = (s2, idx) => s2.lastIndexOf("\n", idx - 1) + 1;
var indentOf = (s2, idx) => /^[ \t]*/.exec(s2.slice(lineStart(s2, idx)))[0];
function insertBefore(src, idx, lines) {
  const ls = lineStart(src, idx);
  const before = src.slice(ls, idx);
  if (before.trim() === "") {
    const prev = src.slice(0, ls).replace(/\s+$/, "");
    const indent = src.startsWith("</", idx) && prev ? indentOf(prev, prev.length) : before;
    const block = lines.map((l) => indent + l).join("\n");
    return `${src.slice(0, ls)}${block}
${src.slice(ls)}`;
  }
  return `${src.slice(0, idx)}${lines.join("")}${src.slice(idx)}`;
}
function insertAfterTag(src, tagStart, tagEnd, lines) {
  const nl = src.indexOf("\n", tagEnd);
  const restOfLine = nl < 0 ? src.slice(tagEnd) : src.slice(tagEnd, nl);
  if (nl < 0 || restOfLine.trim() !== "") return `${src.slice(0, tagEnd)}${lines.join("")}${src.slice(tagEnd)}`;
  const tagIndent = indentOf(src, tagStart);
  const unit = /\t/.test(tagIndent) ? "	" : "  ";
  const indent = tagIndent + unit;
  const block = lines.map((l) => indent + l).join("\n");
  return `${src.slice(0, nl + 1)}${block}
${src.slice(nl + 1)}`;
}
function afterImports(src) {
  const lines = src.split("\n");
  let offset = 0, inImport = false, lastEnd = -1, directiveEnd = 0;
  for (const line of lines) {
    const t = line.trim();
    const next = offset + line.length + 1;
    if (inImport) {
      if (/from\s*['"][^'"]+['"]/.test(t) || /^['"][^'"]+['"];?$/.test(t)) {
        inImport = false;
        lastEnd = next;
      }
    } else if (/^import\b/.test(t)) {
      if (/from\s*['"][^'"]+['"]|^import\s*['"][^'"]+['"]/.test(t)) lastEnd = next;
      else inImport = true;
    } else if (/^['"]use [a-z]+['"];?$/.test(t) && lastEnd < 0) {
      directiveEnd = next;
    }
    offset = next;
  }
  return Math.min(lastEnd >= 0 ? lastEnd : directiveEnd, src.length);
}
var insertLine = (src, idx, line) => `${src.slice(0, idx)}${line}
${src.slice(idx)}`;
function htmlHeadIndex(src) {
  const open = /<head\b[^>]*>/i.exec(src);
  const close = src.search(/<\/head\s*>/i);
  if (!open && close < 0) return -1;
  const from = open ? open.index + open[0].length : 0;
  const to = close >= 0 ? close : src.length;
  const rel = src.slice(from, to).search(/<script\b|%sveltekit\.head%|<\?php\s+wp_head\s*\(/i);
  return rel >= 0 ? from + rel : to;
}

// src/snippet.ts
var CDN_URL = "https://cdn.doubleagent.so/v1/doubleagent.js";
var STUB = "window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};";
var PLACEHOLDER_KEY = "pk_test_REPLACE_ME";
var KEY_RE = /^pk_(live|test)_[A-Za-z0-9]{1,64}$/;
var SECRET_KEY_RE = /^sk_(live|test)_[A-Za-z0-9]{1,64}$/;
var INSTALLED_RE = /cdn\.doubleagent\.so\/v1\/doubleagent\.js|from\s+['"]@doubleagent(?:-so)?\/js['"]/;
var attr = (key) => key ? ` data-key="${key}"` : "";
var htmlSnippet = ({ key, profile }) => [
  `<script>${STUB}</script>`,
  `<script async src="${CDN_URL}"${attr(key)} data-profile="${profile}"></script>`
];
var astroSnippet = ({ key, profile }) => [
  `<script is:inline>${STUB}</script>`,
  `<script is:inline async src="${CDN_URL}"${attr(key)} data-profile="${profile}"></script>`
];
var nextSnippet = ({ key, profile }, Script = "Script") => [
  `<${Script} id="doubleagent-stub" strategy="beforeInteractive">`,
  `  {\`${STUB}\`}`,
  `</${Script}>`,
  `<${Script} src="${CDN_URL}" strategy="beforeInteractive"${attr(key)} data-profile="${profile}" />`
];
var jsxSnippet = ({ key, profile }) => [
  `<script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(STUB)} }} />`,
  `<script async src="${CDN_URL}"${attr(key)} data-profile="${profile}" />`
];
var nuxtConfigSnippet = ({ key, profile }) => [
  "app: {",
  "  head: {",
  "    script: [",
  `      { innerHTML: ${JSON.stringify(STUB)} },`,
  `      { src: '${CDN_URL}', async: true,${key ? ` 'data-key': '${key}',` : ""} 'data-profile': '${profile}' },`,
  "    ],",
  "  },",
  "},"
];
var nuxtPlugin = ({ key, profile }) => `// Added by \`npx @doubleagent-so/cli init\`: loads the Double Agent SDK.
export default defineNuxtPlugin(() => {
  ${STUB}
  const s = document.createElement('script');
  s.async = true;
  s.src = '${CDN_URL}';
${key ? `  s.dataset.key = '${key}';
` : ""}  s.dataset.profile = '${profile}';
  document.head.appendChild(s);
});
`;
var nextDocument = (o) => `import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
${nextSnippet(o).map((l) => `        ${l}`).join("\n")}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`;
function withKey(src, key) {
  if (/data-key="|'data-key':|dataset\.key = '/.test(src)) {
    return src.replace(/(data-key=")[^"]*(")/g, `$1${key}$2`).replace(/('data-key':\s*')[^']*(')/g, `$1${key}$2`).replace(/(dataset\.key = ')[^']*(')/g, `$1${key}$2`);
  }
  const url = CDN_URL.replace(/[./]/g, "\\$&");
  return src.replace(new RegExp(`(src="${url}")`, "g"), `$1 data-key="${key}"`).replace(new RegExp(`(src: '${url}',)`, "g"), `$1 'data-key': '${key}',`).replace(new RegExp(`^([ \\t]*)(s\\.src = '${url}';)$`, "gm"), `$1$2
$1s.dataset.key = '${key}';`);
}

// src/install.ts
var InstallError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "InstallError";
  }
};
var htmlFiles = (files, snippet = htmlSnippet) => (p2, o, notes) => {
  const changes = [];
  for (const path of files) {
    const before = p2.read(path);
    if (before === null) continue;
    const idx = htmlHeadIndex(before);
    if (idx < 0) {
      notes.push(`${path}: no <head> found, skipped`);
      continue;
    }
    changes.push({ path, before, after: insertBefore(before, idx, snippet(o)) });
  }
  if (!changes.length) throw new InstallError(`no file with a <head> found (looked at ${files.join(", ") || "nothing"})`);
  return changes;
};
function withScriptImport(src) {
  const m2 = /import\s+(\w+)\s+from\s+['"]next\/script['"]/.exec(src);
  if (m2) return { src, name: m2[1] };
  return { src: insertLine(src, afterImports(src), "import Script from 'next/script';"), name: "Script" };
}
function afterFirstTag(src, tags, lines, path) {
  for (const re of tags) {
    const m2 = re.exec(src);
    if (m2) return insertAfterTag(src, m2.index, m2.index + m2[0].length, lines);
  }
  throw new InstallError(`${path}: could not find where to insert (${tags.map((t) => t.source).join(" or ")})`);
}
var nextApp = (p2, o) => {
  const path = nextAppLayout(p2);
  const before = p2.read(path);
  const name = /import\s+(\w+)\s+from\s+['"]next\/script['"]/.exec(before)?.[1] ?? "Script";
  const body = afterFirstTag(before, [/<head\b[^>]*>/, /<body\b[^>]*>/], nextSnippet(o, name), path);
  return [{ path, before, after: withScriptImport(body).src }];
};
var nextPages = (p2, o) => {
  const path = nextDocumentPath(p2);
  if (!path) {
    const dir = p2.has("src/pages") ? "src/pages" : "pages";
    const ext = p2.has("tsconfig.json") ? "tsx" : "js";
    return [{ path: `${dir}/_document.${ext}`, before: null, after: nextDocument(o) }];
  }
  let src = p2.read(path);
  src = src.replace(/^([ \t]*)<Head\s*\/>/m, (_m, ind) => `${ind}<Head>
${ind}</Head>`);
  const name = /import\s+(\w+)\s+from\s+['"]next\/script['"]/.exec(src)?.[1] ?? "Script";
  src = afterFirstTag(src, [/<Head(?:\s[^>]*)?>/], nextSnippet(o, name), path);
  return [{ path, before: p2.read(path), after: withScriptImport(src).src }];
};
var remix = (p2, o) => {
  const path = p2.first("app/root.tsx", "app/root.jsx", "app/root.ts", "app/root.js");
  const before = p2.read(path);
  return [{ path, before, after: afterFirstTag(before, [/<head\b[^>]*>/], jsxSnippet(o), path) }];
};
var astro = (p2, o, notes) => {
  const astroFiles = p2.files().filter((f) => f.endsWith(".astro") && /<head\b/i.test(p2.read(f) ?? ""));
  const layouts = astroFiles.filter((f) => f.startsWith("src/layouts/"));
  const targets = layouts.length ? layouts : astroFiles;
  if (!layouts.length && targets.length) notes.push("no src/layouts/*.astro with <head>; edited pages directly");
  return htmlFiles(targets, astroSnippet)(p2, o, notes);
};
var nuxt = (p2, o, notes) => {
  const path = p2.first("nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs");
  const before = path ? p2.read(path) : null;
  const call = before ? /defineNuxtConfig\(\s*\{/.exec(before) : null;
  if (path && before && call && !/^\s*app\s*:/m.test(before)) {
    return [{ path, before, after: insertAfterTag(before, call.index, call.index + call[0].length, nuxtConfigSnippet(o)) }];
  }
  const dir = p2.has("app/app.vue") ? "app/plugins" : "plugins";
  const ext = path?.endsWith(".ts") ? "ts" : "js";
  notes.push(`nuxt.config already has an \`app\` block; added ${dir}/doubleagent.client.${ext} instead (the tag is injected client-side, so \`verify\` cannot see it in server HTML)`);
  return [{ path: `${dir}/doubleagent.client.${ext}`, before: null, after: nuxtPlugin(o) }];
};
var rootHtml = (p2) => {
  const root = p2.files().filter((f) => !f.includes("/") && /\.html?$/i.test(f));
  return root.length ? root : ["public/index.html"];
};
var PLANNERS = {
  "next-app": nextApp,
  "next-pages": nextPages,
  remix,
  astro,
  nuxt,
  vite: (p2, o, n) => htmlFiles(["index.html"])(p2, o, n),
  sveltekit: (p2, o, n) => htmlFiles(["src/app.html"])(p2, o, n),
  "wordpress-theme": (p2, o, n) => htmlFiles(["header.php"])(p2, o, n),
  html: (p2, o, n) => htmlFiles(rootHtml(p2))(p2, o, n)
};
var installedIn = (p2) => p2.files().filter((f) => INSTALLED_RE.test(p2.read(f) ?? ""));
function planInstall(p2, stack, o) {
  const notes = [];
  if (stack.id === "shopify-theme") {
    notes.push("Add the SDK snippet once to the head of layout/theme.liquid. The CLI provides instructions without editing the theme; Shopify cart attributes are written by the SDK when a cart exists and consent permits.");
    return { status: "advice", changes: [], notes };
  }
  const existing = installedIn(p2);
  if (existing.length) {
    const changes = o.key ? existing.flatMap((path) => {
      const before = p2.read(path);
      const after = withKey(before, o.key);
      return after !== before ? [{ path, before, after }] : [];
    }) : [];
    if (!changes.length) notes.push(`already installed in ${existing.join(", ")}`);
    return { status: changes.length ? "update-key" : "installed", changes, notes };
  }
  const planner = PLANNERS[stack.id];
  if (!planner) return { status: "unsupported", changes: [], notes };
  return { status: "install", changes: planner(p2, o, notes), notes };
}

// src/project.ts
import { existsSync, readdirSync, readFileSync as readFileSync2, statSync } from "node:fs";
import { join as join2, relative } from "node:path";
var SKIP_DIRS = /* @__PURE__ */ new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".output", ".svelte-kit", "out", "vendor", ".vercel", ".netlify", "coverage", ".astro", ".cache"]);
var SOURCE_EXT = /\.(html?|[cm]?[jt]sx?|vue|svelte|astro|liquid|php)$/i;
var MAX_FILES = 3e3;
var MAX_BYTES = 512 * 1024;
function openProject(cwd) {
  const has = (rel) => existsSync(join2(cwd, rel));
  const read = (rel) => {
    try {
      return readFileSync2(join2(cwd, rel), "utf8");
    } catch {
      return null;
    }
  };
  let pkg = null;
  try {
    pkg = JSON.parse(read("package.json") ?? "null");
  } catch {
    pkg = null;
  }
  let cache;
  return {
    cwd,
    pkg,
    has,
    read,
    first: (...rels) => rels.find(has),
    dep: (name) => !!(pkg?.dependencies?.[name] ?? pkg?.devDependencies?.[name]),
    files() {
      if (cache) return cache;
      const out = [];
      const walk2 = (dir) => {
        let entries;
        try {
          entries = readdirSync(dir);
        } catch {
          return;
        }
        for (const name of entries) {
          if (out.length >= MAX_FILES) return;
          const abs = join2(dir, name);
          let st;
          try {
            st = statSync(abs);
          } catch {
            continue;
          }
          if (st.isDirectory()) {
            if (!SKIP_DIRS.has(name)) walk2(abs);
          } else if (SOURCE_EXT.test(name) && st.size <= MAX_BYTES) out.push(relative(cwd, abs).replace(/\\/g, "/"));
        }
      };
      walk2(cwd);
      return cache = out.sort();
    }
  };
}

// src/skill.ts
var NEXT_IMPORT = "import Script from 'next/script';";
var HEAD = "inside <head>, before any other <script>";
var GUIDES = {
  html: { file: "every page (*.html)", where: HEAD, lines: htmlSnippet },
  vite: { file: "index.html", where: HEAD, lines: htmlSnippet },
  "next-app": { file: "app/layout.tsx (or src/app/layout.tsx)", where: "right after <head> (or first inside <body>)", import: NEXT_IMPORT, lines: (o) => nextSnippet(o) },
  "next-pages": { file: "pages/_document.tsx", where: "inside <Head>", import: NEXT_IMPORT, lines: (o) => nextSnippet(o) },
  astro: { file: "src/layouts/Layout.astro (every layout with <head>)", where: HEAD, lines: astroSnippet },
  nuxt: { file: "nuxt.config.ts", where: "first entry inside defineNuxtConfig({ \u2026 }) (merge into an existing app.head if present)", lines: nuxtConfigSnippet },
  sveltekit: { file: "src/app.html", where: "inside <head>, before %sveltekit.head%", lines: htmlSnippet },
  remix: { file: "app/root.tsx", where: "right after <head>", lines: jsxSnippet },
  wordpress: { file: "header.php (classic theme) or a header-code plugin", where: "before <?php wp_head(); ?>", lines: htmlSnippet },
  wix: { file: "Settings \u2192 Custom code \u2192 + Add Custom Code", where: "All pages, Head, load once", lines: htmlSnippet },
  squarespace: { file: "Settings \u2192 Developer tools \u2192 Code injection", where: "Header", lines: htmlSnippet },
  webflow: { file: "Site settings \u2192 Custom code", where: "Head code, then Publish", lines: htmlSnippet },
  shopify: {
    file: "layout/theme.liquid",
    where: HEAD,
    lines: htmlSnippet,
    note: "Add the snippet once to the shared theme head. The SDK detects Shopify and writes cart attributes when a cart exists and consent permits."
  }
};
var SNIPPET_STACKS = Object.keys(GUIDES);
function snippetFor(stack, o) {
  const g2 = GUIDES[stack];
  if (!g2) throw new CliError(`unknown stack "${stack}" (one of: ${SNIPPET_STACKS.join(", ")})`);
  return { stack, file: g2.file, where: g2.where, ...g2.import ? { import: g2.import } : {}, lines: g2.lines(o), ...g2.note ? { note: g2.note } : {} };
}
function publicKey(args) {
  const k = str(args.flags.key);
  if (k === void 0) return void 0;
  if (SECRET_KEY_RE.test(k)) throw new CliError("that is a secret key (sk_\u2026): it must never be put in client code");
  if (!KEY_RE.test(k)) throw new CliError(`"${k}" is not a public key (pk_live_\u2026 / pk_test_\u2026)`);
  return k;
}
async function snippetCmd(args, io) {
  const stack = args.pos[0];
  if (!stack) throw new CliError(`usage: snippet <stack> [--key pk_\u2026] [--json]  (stacks: ${SNIPPET_STACKS.join(", ")})`);
  const s2 = snippetFor(stack, { key: publicKey(args), profile: str(args.flags.profile) ?? "auto" });
  if (args.flags.json) {
    io.out(JSON.stringify(s2, null, 2));
    return 0;
  }
  io.out(`# ${s2.file}: ${s2.where}`);
  if (s2.note) io.out(s2.note);
  if (s2.import) io.out(s2.import);
  for (const l of s2.lines) io.out(l);
  return 0;
}
async function createAccountCmd(args, io) {
  const email = str(args.flags.email);
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new CliError("usage: create-account --email you@example.com [--domain host] [--name name]");
  const domain = str(args.flags.domain)?.toLowerCase();
  const a = await createAccount(args, io, { email, domain, name: str(args.flags.name) });
  if (args.flags.json) {
    io.out(JSON.stringify({ ...a, warning: "keys are shown once; sk_* is server-side only, never in client code" }, null, 2));
    return 0;
  }
  io.out(`Created account ${a.account_id}, site ${a.site_id}.`);
  io.out("Keys (shown once; public keys go in data-key, secret keys stay server-side, never in client code):");
  for (const [k, v] of Object.entries(a.keys ?? {})) if (v) io.out(`  ${k}: ${v}`);
  const host = a.verify?.hostname ?? domain;
  if (a.verify?.token && host) io.out(`Verify the domain to see data: DNS TXT _doubleagent.${host} "da-verify=${a.verify.token}" (or meta tag / .well-known file; see references/claim)`);
  io.out(`Confirm the email sent to ${email}${a.login_url ? ` (or open ${a.login_url})` : ""}.`);
  return 0;
}

// src/verify.ts
var TIMEOUT_MS = 1e4;
var isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
function parseInstallCheck(body) {
  if (!isObj(body)) return void 0;
  const bool = (k) => typeof body[k] === "boolean" ? body[k] : void 0;
  const s2 = (k) => typeof body[k] === "string" ? body[k] : void 0;
  const problems = Array.isArray(body.problems) ? body.problems.map((p2) => isObj(p2) ? { code: typeof p2.code === "string" ? p2.code : void 0, message: typeof p2.message === "string" ? p2.message : void 0, fix: typeof p2.fix === "string" ? p2.fix : void 0 } : { message: String(p2) }) : void 0;
  return {
    ok: bool("ok"),
    script_found: bool("script_found"),
    script_src: s2("script_src"),
    key: s2("key"),
    key_valid: bool("key_valid"),
    profile_attr: s2("profile_attr"),
    stub_before_script: bool("stub_before_script"),
    keyless: bool("keyless"),
    claim_url: s2("claim_url"),
    integrations_detected: Array.isArray(body.integrations_detected) ? body.integrations_detected.filter((x) => typeof x === "string") : void 0,
    last_beacon_at: s2("last_beacon_at") ?? (body.last_beacon_at === null ? null : void 0),
    problems
  };
}
var timeoutSignal = (ms) => {
  const c2 = new AbortController();
  setTimeout(() => c2.abort(), ms).unref?.();
  return c2.signal;
};
var attr2 = (html, name) => new RegExp(`${name}["']?\\s*[:=]\\s*\\\\?["']([^"'\\\\]+)`).exec(html)?.[1];
async function verify(url, opts = {}) {
  const f = opts.fetch ?? fetch;
  const problems = [];
  const result = {
    url,
    ok: false,
    script: false,
    stub: false,
    keyValid: false,
    keyless: false,
    integrations: [],
    installCheck: { reachable: false },
    problems
  };
  let html = "";
  try {
    const res = await f(url, { headers: { "User-Agent": "doubleagent-cli (install verify)", Accept: "text/html" }, redirect: "follow", signal: timeoutSignal(TIMEOUT_MS) });
    result.status = res.status;
    html = await res.text();
    if (!res.ok) problems.push(`GET ${url} returned ${res.status}`);
  } catch (e2) {
    problems.push(`could not fetch ${url}: ${e2.message}`);
    return result;
  }
  result.script = /cdn\.doubleagent\.so\/v1\/doubleagent\.js/.test(html);
  result.stub = html.includes("window.doubleagent=window.doubleagent||");
  result.key = attr2(html, "data-key");
  result.endpoint = attr2(html, "data-endpoint");
  result.keyValid = !!result.key && KEY_RE.test(result.key) && result.key !== PLACEHOLDER_KEY;
  result.integrations = detectInHtml(html);
  if (!result.script) problems.push("SDK script tag not found in the server HTML (client-side injection is not visible here)");
  if (result.script && !result.stub) problems.push("queue stub missing: calls made before the SDK loads will throw");
  if (result.key === PLACEHOLDER_KEY) problems.push(`placeholder key ${PLACEHOLDER_KEY} is still in place`);
  else if (result.key && !result.keyValid) problems.push(`data-key "${result.key}" is not a pk_live_/pk_test_ key`);
  result.keyless = result.script && !result.key;
  const api = (opts.api ?? result.endpoint ?? DEFAULT_API).replace(/\/+$/, "");
  try {
    const res = await f(`${api}/v1/install-check?url=${encodeURIComponent(url)}`, { headers: { Accept: "application/json" }, signal: timeoutSignal(TIMEOUT_MS) });
    result.installCheck = { reachable: true, status: res.status };
    const text = await res.text();
    try {
      result.installCheck.body = JSON.parse(text);
    } catch {
      result.installCheck.body = text.slice(0, 500);
    }
    if (res.ok) result.installCheck.check = parseInstallCheck(result.installCheck.body);
  } catch (e2) {
    result.installCheck = { reachable: false, error: e2.message };
  }
  result.ok = result.script && result.stub && (result.keyless || result.keyValid);
  return result;
}

// src/simulation/command.ts
import { mkdir as mkdir2, writeFile as writeFile2 } from "node:fs/promises";
import { dirname as dirname3, resolve as resolve2 } from "node:path";

// ../core/src/catalog/fingerprinted.ts
var FINGERPRINTS = [
  {
    id: "anthropic.claude-in-chrome",
    class: "agent",
    family: "claude",
    markers: [
      { selector: "#claude-agent-stop-container, #claude-agent-stop-button", code: "marker.claude_active" },
      { selector: "#claude-agent-glow-border, #claude-phantom-cursor, #claude-static-indicator-container", code: "marker.claude_active" },
      { selector: "#claude-agent-animation-styles", code: "marker.claude_residue", llr: 4 },
      { selector: '[id^="claude-agent-"]', code: "marker.claude" }
    ]
  },
  { id: "perplexity.comet", class: "agent", family: "perplexity", markers: [{ selector: '#pplx-agent-overlay-stop-button, [id^="pplx-agent"]', code: "marker.comet" }] },
  { id: "fellou.browser", class: "agent", markers: [{ selector: "#eko-highlight-container", code: "marker.eko" }] },
  {
    id: "browser-use.agent",
    class: "agent",
    family: "browser_use",
    markers: [{ selector: "#browser-use-debug-highlights, #browser-use-demo-panel, [data-browser-use-highlight], [data-browser-use-interaction-highlight], [data-browser-use-coordinate-highlight]", code: "marker.browser_use" }],
    globals: [{ pattern: "^__browserUseDemoPanelLoaded$", code: "global.browser_use" }]
  },
  {
    id: "browserbase.stagehand",
    class: "agent",
    family: "browserbase",
    markers: [{ selector: "#__v3_cursor_overlay__, [data-stagehand-mask]", code: "marker.stagehand" }],
    globals: [{ pattern: "^__stagehand", code: "global.stagehand" }]
  },
  {
    id: "skyvern.agent",
    class: "agent",
    family: "skyvern",
    markers: [
      { selector: "[data-skyvern-otp-box], #boundingBoxContainer", code: "marker.skyvern" },
      { selector: "[unique_id]", code: "marker.skyvern_ids", llr: 5 }
    ],
    globals: [{ pattern: "^GlobalSkyvernFrameIndex$|^globalDomDepthMap$|^globalParsedElementCounter$|^__PW_CURSOR_VIS__$|^__pw_trails$", code: "global.skyvern" }]
  },
  {
    id: "selenium.webdriver",
    class: "bot",
    globals: [
      { pattern: "^\\$?cdc_|^\\$wdc_", code: "global.chromedriver" },
      { pattern: "^_Selenium_IDE_Recorder$|^__webdriver_|^__selenium_|^__fxdriver_|^__driver_evaluate$|^_selenium$|^callSelenium$", code: "global.selenium" }
    ]
  },
  { id: "playwright.automation", class: "bot", globals: [{ pattern: "^__playwright|^__pwInitScripts$|^playwright__binding", code: "global.playwright" }] },
  { id: "puppeteer.headless", class: "bot", globals: [{ pattern: "^__puppeteer_", code: "global.puppeteer" }] },
  { id: "legacy.headless", class: "bot", globals: [{ pattern: "^__nightmare$|^_phantom$|^callPhantom$|^domAutomation", code: "global.legacy_automation" }] }
];

// src/simulation/fixtures.ts
var globals = {
  "global.browser_use": "__browserUseDemoPanelLoaded",
  "global.stagehand": "__stagehand_simulation",
  "global.skyvern": "GlobalSkyvernFrameIndex",
  "global.chromedriver": "$cdc_simulation",
  "global.selenium": "_Selenium_IDE_Recorder",
  "global.playwright": "__playwright_simulation",
  "global.puppeteer": "__puppeteer_simulation",
  "global.legacy_automation": "__nightmare"
};
var FIXTURES = FINGERPRINTS.flatMap((entry) => [
  ...(entry.markers ?? []).flatMap((rule, i2) => rule.selector.split(",").map((selector, j) => ({
    id: `${entry.id}:marker:${i2}:${j}`,
    catalogId: entry.id,
    kind: "marker",
    value: selector.trim(),
    reason: rule.code
  }))),
  ...(entry.globals ?? []).filter((rule) => globals[rule.code]).map((rule, i2) => ({
    id: `${entry.id}:global:${i2}`,
    catalogId: entry.id,
    kind: "global",
    value: globals[rule.code],
    reason: rule.code
  }))
]);

// ../core/src/catalog/entries.ts
var OAI = "https://developers.openai.com/api/docs/bots";
var ANT = "https://support.claude.com/en/articles/8896518";
var PPLX = "https://docs.perplexity.ai/guides/bots";
var GOOG_COMMON = "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers";
var GOOG_USER = "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers";
var GOOG_SPECIAL = "https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers";
var GIP = "https://developers.google.com/static/crawling/ipranges";
var META = "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers";
var AMZ = "https://developer.amazon.com/amazonbot";
var MISTRAL = "https://docs.mistral.ai/robots";
var AIROBOTS = "https://github.com/ai-robots-txt/ai.robots.txt";
var CUA = "https://github.com/monperrus/crawler-user-agents";
var RADAR = "https://radar.cloudflare.com/bots/directory";
var WBA_REGISTRY = "https://assets.radar.cloudflare.com/bots/signature-agent-registry.txt";
var ANTHROPIC_IPS = [{ vendor: "anthropic", url: "https://claude.com/crawling/bots.json" }];
var GOOGLE_RDNS = [".googlebot.com", ".google.com", ".googleusercontent.com"];
var GOOGLE_COMMON_IPS = [{ vendor: "google_common", url: `${GIP}/common-crawlers.json` }];
var GOOGLE_FETCHER_IPS = [
  { vendor: "google_user_fetchers", url: `${GIP}/user-triggered-fetchers.json` },
  { vendor: "google_user_fetchers_google", url: `${GIP}/user-triggered-fetchers-google.json` }
];
var declared = (id, name, operator, ua, o = {}) => ({
  id,
  name,
  operator,
  class: "bot",
  behaviour: "training",
  surface: "crawler",
  operatorType: "direct",
  verifiable: "declared",
  identify: { ua },
  respectsRobots: "unknown",
  source: AIROBOTS,
  ...o
});
var withFp = (e2) => {
  const f = FINGERPRINTS.find((x) => x.id === e2.id);
  return { ...e2, identify: { ...e2.identify, ...f?.markers ? { markers: f.markers } : {}, ...f?.globals ? { globals: f.globals } : {} } };
};
var automation = (id, name, operator, source, ua) => withFp({
  id,
  name,
  operator,
  class: "bot",
  behaviour: "data_collection",
  surface: "automation_tool",
  operatorType: "intermediary",
  verifiable: ua ? "declared" : "stealth",
  identify: ua ? { ua } : {},
  respectsRobots: "unknown",
  source
});
var fingerprinted = [
  withFp({
    id: "anthropic.claude-in-chrome",
    name: "Claude in Chrome",
    operator: "anthropic",
    class: "agent",
    behaviour: "agent",
    surface: "consumer_agent_browser",
    operatorType: "intermediary",
    verifiable: "stealth",
    family: "claude",
    identify: {},
    docsUrl: "https://support.claude.com/en/articles/12012173",
    source: "Claude in Chrome extension v1.0.94 (fcoeoabgfenejglbffodgkkbkcdhcgfn)"
  }),
  withFp({
    id: "perplexity.comet",
    name: "Comet",
    operator: "perplexity",
    class: "agent",
    behaviour: "agent",
    surface: "consumer_agent_browser",
    operatorType: "intermediary",
    verifiable: "stealth",
    family: "perplexity",
    identify: {},
    source: "https://aiagentindex.mit.edu/2025/comet"
  }),
  withFp({
    id: "fellou.browser",
    name: "Fellou",
    operator: "fellou",
    class: "agent",
    behaviour: "agent",
    surface: "consumer_agent_browser",
    operatorType: "intermediary",
    verifiable: "stealth",
    identify: {},
    source: "https://github.com/FellouAI/eko (use in the product unverified)"
  }),
  withFp({
    id: "browser-use.agent",
    name: "Browser Use",
    operator: "browser-use",
    class: "agent",
    behaviour: "agent",
    surface: "agent_framework",
    operatorType: "intermediary",
    verifiable: "stealth",
    family: "browser_use",
    identify: { ua: ["browser-use"], signatureAgent: ["browser-use.com"] },
    source: "https://github.com/browser-use/browser-use"
  }),
  withFp({
    id: "browserbase.stagehand",
    name: "Browserbase / Stagehand",
    operator: "browserbase",
    class: "agent",
    behaviour: "agent",
    surface: "agent_framework",
    operatorType: "intermediary",
    verifiable: "signed",
    family: "browserbase",
    identify: { ua: ["Browserbase"], signatureAgent: ["browserbase.com"] },
    docsUrl: "https://docs.browserbase.com/platform/identity",
    source: "https://github.com/browserbase/stagehand"
  }),
  withFp({
    id: "skyvern.agent",
    name: "Skyvern",
    operator: "skyvern",
    class: "agent",
    behaviour: "agent",
    surface: "agent_framework",
    operatorType: "intermediary",
    verifiable: "stealth",
    family: "skyvern",
    identify: { ua: ["Skyvern"], signatureAgent: ["skyvern.com"] },
    source: "https://github.com/Skyvern-AI/skyvern"
  }),
  automation("selenium.webdriver", "Selenium / WebDriver", "selenium", "https://www.selenium.dev"),
  automation("playwright.automation", "Playwright", "playwright", "https://playwright.dev"),
  automation("puppeteer.headless", "Puppeteer", "puppeteer", "https://pptr.dev"),
  automation("legacy.headless", "PhantomJS / Nightmare", "legacy", CUA, ["PhantomJS"])
];
var agents = [
  {
    id: "openai.chatgpt-agent",
    name: "ChatGPT agent",
    operator: "openai",
    class: "agent",
    behaviour: "agent",
    surface: "cloud_browser_agent",
    operatorType: "intermediary",
    verifiable: "signed",
    family: "openai",
    identify: { ua: ["ChatGPT Agent"], signatureAgent: ["chatgpt.com"], ipLists: [{ vendor: "openai_agents", url: "https://openai.com/chatgpt-agents.json" }] },
    docsUrl: "https://help.openai.com/en/articles/11845367",
    source: "https://help.openai.com/en/articles/11845367"
  },
  {
    id: "openai.atlas",
    name: "ChatGPT Atlas",
    operator: "openai",
    class: "agent",
    behaviour: "agent",
    surface: "consumer_agent_browser",
    operatorType: "intermediary",
    verifiable: "stealth",
    family: "openai",
    identify: {},
    docsUrl: "https://help.openai.com/en/articles/12628199",
    source: "https://help.openai.com/en/articles/12628199"
  },
  {
    id: "google.gemini-in-chrome",
    name: "Gemini in Chrome",
    operator: "google",
    class: "agent",
    behaviour: "agent",
    surface: "consumer_agent_browser",
    operatorType: "intermediary",
    verifiable: "stealth",
    family: "google",
    identify: {},
    source: "press (unverified fingerprints)"
  },
  {
    id: "microsoft.copilot-actions",
    name: "Copilot Actions in Edge",
    operator: "microsoft",
    class: "agent",
    behaviour: "agent",
    surface: "consumer_agent_browser",
    operatorType: "intermediary",
    verifiable: "stealth",
    identify: {},
    source: "https://www.humansecurity.com/ai-agent/copilot-actions"
  },
  { id: "opera.neon", name: "Opera Neon", operator: "opera", class: "agent", behaviour: "agent", surface: "consumer_agent_browser", operatorType: "intermediary", verifiable: "stealth", identify: {}, source: "MIT AI Agent Index" },
  { id: "browsercompany.dia", name: "Dia", operator: "browsercompany", class: "agent", behaviour: "agent", surface: "consumer_agent_browser", operatorType: "intermediary", verifiable: "stealth", identify: {}, source: "press (unverified fingerprints)" },
  { id: "genspark.browser", name: "Genspark Browser", operator: "genspark", class: "agent", behaviour: "agent", surface: "consumer_agent_browser", operatorType: "intermediary", verifiable: "stealth", identify: {}, source: "press (unverified fingerprints)" },
  {
    id: "manus.agent",
    name: "Manus",
    operator: "manus",
    class: "agent",
    behaviour: "agent",
    surface: "cloud_browser_agent",
    operatorType: "intermediary",
    verifiable: "signed",
    family: "manus",
    identify: { ua: ["Manus-User"], signatureAgent: ["manus.im", "manus.ai"] },
    source: WBA_REGISTRY
  },
  {
    id: "amazon.nova-act",
    name: "Amazon Nova Act",
    operator: "amazon",
    class: "agent",
    behaviour: "agent",
    surface: "agent_framework",
    operatorType: "intermediary",
    verifiable: "declared",
    family: "amazon",
    identify: { ua: ["Agent-NovaAct", "NovaAct"] },
    source: "https://github.com/aws/nova-act"
  },
  {
    id: "amazon.agentcore-browser",
    name: "Bedrock AgentCore Browser",
    operator: "amazon",
    class: "agent",
    behaviour: "agent",
    surface: "cloud_browser_agent",
    operatorType: "intermediary",
    verifiable: "signed",
    family: "amazon",
    identify: {
      signatureAgent: [
        "xhah6q48pbxb4.keydirectory.signer.us-east-1.on.aws",
        "ogtj5xdh5udp4.keydirectory.signer.us-east-2.on.aws",
        "bxtrz00tv0lm1.keydirectory.signer.us-west-2.on.aws",
        "c3drvlj8gw240.keydirectory.signer.eu-west-1.on.aws",
        "o42g509c7dlj6.keydirectory.signer.eu-central-1.on.aws",
        "kzejmtkesloc1.keydirectory.signer.ap-northeast-1.on.aws",
        "wdfzm130yrb91.keydirectory.signer.ap-south-1.on.aws",
        "slf696jfe4gp0.keydirectory.signer.ap-southeast-1.on.aws",
        "meh0x7tptr6o1.keydirectory.signer.ap-southeast-2.on.aws"
      ]
    },
    source: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-web-bot-auth.html"
  },
  { id: "agi.agent", name: "AGI Agent", operator: "agi", class: "agent", behaviour: "agent", surface: "cloud_browser_agent", operatorType: "intermediary", verifiable: "signed", identify: { signatureAgent: ["agi.tech"] }, source: RADAR },
  { id: "anchor.browser", name: "Anchor Browser", operator: "anchor", class: "agent", behaviour: "agent", surface: "cloud_browser_agent", operatorType: "intermediary", verifiable: "signed", identify: { ua: ["Anchor Browser"], signatureAgent: ["anchorbrowser.io"] }, source: "https://docs.anchorbrowser.io" },
  { id: "kernel.browser", name: "Kernel", operator: "kernel", class: "agent", behaviour: "agent", surface: "cloud_browser_agent", operatorType: "intermediary", verifiable: "signed", identify: { signatureAgent: ["kernel.sh"] }, source: "https://www.kernel.sh/docs" },
  { id: "hyperbrowser.browser", name: "Hyperbrowser", operator: "hyperbrowser", class: "agent", behaviour: "agent", surface: "cloud_browser_agent", operatorType: "intermediary", verifiable: "stealth", identify: {}, source: "https://docs.hyperbrowser.ai" },
  { id: "steel.browser", name: "Steel", operator: "steel", class: "agent", behaviour: "agent", surface: "cloud_browser_agent", operatorType: "intermediary", verifiable: "stealth", identify: {}, source: "https://docs.steel.dev" },
  {
    id: "cloudflare.browser-run",
    name: "Cloudflare Browser Run",
    operator: "cloudflare",
    class: "agent",
    behaviour: "agent",
    surface: "cloud_browser_agent",
    operatorType: "intermediary",
    verifiable: "signed",
    identify: { ua: ["CloudflareBrowserRenderingCrawler"], signatureAgent: ["cloudflare-browser-rendering-085.workers.dev"] },
    source: "https://developers.cloudflare.com/browser-run/"
  },
  { id: "block.goose", name: "Goose", operator: "block", class: "agent", behaviour: "agent", surface: "agent_framework", operatorType: "intermediary", verifiable: "signed", identify: {}, source: "https://blog.cloudflare.com/signed-agents/" },
  ...[
    ["twin.agent", "Twin", "twin", "twin.so", "TwinAgent"],
    ["rye.agent", "Rye", "rye", "rye.xyz"],
    ["stripe.link-cli", "Stripe Link", "stripe", "api.link.com"],
    ["strivve.agent", "Strivve", "strivve", "cardsavr.io"],
    // In Cloudflare's signed-agent registry; directory hosts not yet confirmed, so no automatic match.
    ["henry.agent", "Henry", "henry", ""],
    ["nekuda.agent", "Nekuda", "nekuda", ""],
    ["firmly.agent", "Firmly", "firmly", ""]
  ].map(([id, name, operator, host, ua]) => ({
    id,
    name,
    operator,
    class: "agent",
    behaviour: "transact",
    surface: "cloud_browser_agent",
    operatorType: "intermediary",
    verifiable: "signed",
    identify: { ...host ? { signatureAgent: [host] } : {}, ...ua ? { ua: [ua] } : {} },
    source: WBA_REGISTRY
  }))
];
var aiFetch = [
  { id: "openai.chatgpt-user", name: "ChatGPT-User", operator: "openai", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "ip", family: "openai", identify: { ua: ["ChatGPT-User"], ipLists: [{ vendor: "openai_chatgpt_user", url: "https://openai.com/chatgpt-user.json" }] }, robotsToken: "ChatGPT-User", respectsRobots: false, docsUrl: OAI, source: OAI },
  { id: "openai.connectors", name: "ChatGPT connectors", operator: "openai", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "ip", family: "openai", identify: { ipLists: [{ vendor: "openai_connectors", url: "https://openai.com/chatgpt-connectors.json" }] }, source: "https://developers.openai.com/api/docs/ip-addresses" },
  { id: "openai.oai-searchbot", name: "OAI-SearchBot", operator: "openai", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "openai", identify: { ua: ["OAI-SearchBot"], ipLists: [{ vendor: "openai_searchbot", url: "https://openai.com/searchbot.json" }] }, robotsToken: "OAI-SearchBot", respectsRobots: true, docsUrl: OAI, source: OAI },
  { id: "openai.adsbot", name: "OAI-AdsBot", operator: "openai", class: "bot", behaviour: "ads_verification", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "openai", identify: { ua: ["OAI-AdsBot"], ipLists: [{ vendor: "openai_adsbot", url: "https://openai.com/adsbot.json" }] }, docsUrl: OAI, source: OAI },
  { id: "anthropic.claude-user", name: "Claude-User", operator: "anthropic", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "ip", family: "claude", identify: { ua: ["Claude-User"], ipLists: ANTHROPIC_IPS }, robotsToken: "Claude-User", respectsRobots: true, docsUrl: ANT, source: ANT },
  { id: "anthropic.claude-searchbot", name: "Claude-SearchBot", operator: "anthropic", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "claude", identify: { ua: ["Claude-SearchBot"], ipLists: ANTHROPIC_IPS }, robotsToken: "Claude-SearchBot", respectsRobots: true, docsUrl: ANT, source: ANT },
  { id: "perplexity.perplexity-user", name: "Perplexity-User", operator: "perplexity", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "ip", family: "perplexity", identify: { ua: ["Perplexity-User"], ipLists: [{ vendor: "perplexity_user", url: "https://www.perplexity.com/perplexity-user.json" }] }, robotsToken: "Perplexity-User", respectsRobots: false, docsUrl: PPLX, source: PPLX },
  { id: "perplexity.perplexitybot", name: "PerplexityBot", operator: "perplexity", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "perplexity", identify: { ua: ["PerplexityBot"], ipLists: [{ vendor: "perplexity_bot", url: "https://www.perplexity.com/perplexitybot.json" }] }, robotsToken: "PerplexityBot", respectsRobots: true, docsUrl: PPLX, source: PPLX },
  { id: "google.google-agent", name: "Google-Agent", operator: "google", class: "agent", behaviour: "agent", surface: "cloud_browser_agent", operatorType: "intermediary", verifiable: "signed", family: "google", identify: { ua: ["Google-Agent"], signatureAgent: ["agent.bot.goog"], ipLists: [{ vendor: "google_user_triggered", url: `${GIP}/user-triggered-agents.json` }], rdns: GOOGLE_RDNS }, respectsRobots: false, docsUrl: GOOG_USER, source: GOOG_USER },
  { id: "google.gemini-notebook", name: "Google-GeminiNotebook", operator: "google", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "ip", family: "google", identify: { ua: ["Google-GeminiNotebook", "Google-NotebookLM", "NotebookLM"], ipLists: GOOGLE_FETCHER_IPS, rdns: GOOGLE_RDNS }, respectsRobots: false, docsUrl: GOOG_USER, source: GOOG_USER },
  { id: "google.gemini-deep-research", name: "Gemini Deep Research", operator: "google", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "declared", family: "google", identify: { ua: ["Gemini-Deep-Research", "GoogleAgent-URLContext", "GoogleAgent-Mariner", "Google-Firebase"] }, source: AIROBOTS },
  { id: "google.user-fetchers", name: "Google user-triggered fetchers", operator: "google", class: "bot", behaviour: "feed_fetching", surface: "user_fetch", operatorType: "direct", verifiable: "ip", family: "google", identify: { ua: ["Google-Read-Aloud", "Google Read Aloud", "Google-Pinpoint", "FeedFetcher-Google", "GoogleProducer", "Google-Site-Verification", "Google-CWS", "GoogleMessages"], ipLists: GOOGLE_FETCHER_IPS, rdns: GOOGLE_RDNS }, respectsRobots: false, docsUrl: GOOG_USER, source: GOOG_USER },
  { id: "meta.externalfetcher", name: "Meta-ExternalFetcher", operator: "meta", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "signed", identify: { ua: ["meta-externalfetcher"], signatureAgent: ["www.meta.com"] }, respectsRobots: false, docsUrl: META, source: META },
  { id: "meta.webindexer", name: "Meta-WebIndexer", operator: "meta", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "declared", identify: { ua: ["meta-webindexer"] }, respectsRobots: true, docsUrl: META, source: META },
  { id: "mistral.user", name: "MistralAI-User", operator: "mistral", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "ip", identify: { ua: ["MistralAI-User"], ipLists: [{ vendor: "mistral_user", url: "https://mistral.ai/mistralai-user-ips.json" }] }, respectsRobots: true, docsUrl: MISTRAL, source: MISTRAL },
  { id: "mistral.index", name: "MistralAI-Index", operator: "mistral", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", identify: { ua: ["MistralAI-Index"], ipLists: [{ vendor: "mistral_index", url: "https://mistral.ai/mistralai-index-ips.json" }] }, respectsRobots: true, docsUrl: MISTRAL, source: MISTRAL },
  { id: "duckduckgo.duckassistbot", name: "DuckAssistBot", operator: "duckduckgo", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "signed", identify: { ua: ["DuckAssistBot"], signatureAgent: ["assistbot.duckduckgo.com"], ipLists: [{ vendor: "duckassistbot", url: "https://duckduckgo.com/duckassistbot.json" }] }, respectsRobots: true, source: "https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot" },
  { id: "amazon.amzn-user", name: "Amzn-User", operator: "amazon", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "declared", family: "amazon", identify: { ua: ["Amzn-User", "AmazonBuyForMe"] }, respectsRobots: false, docsUrl: AMZ, source: AMZ },
  { id: "amazon.amzn-searchbot", name: "Amzn-SearchBot", operator: "amazon", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "declared", family: "amazon", identify: { ua: ["Amzn-SearchBot"] }, respectsRobots: true, docsUrl: AMZ, source: AMZ },
  { id: "you.youbot", name: "YouBot", operator: "you", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "signed", identify: { ua: ["YouBot"], signatureAgent: ["you.com"] }, respectsRobots: true, source: RADAR },
  { id: "exa.searchbot", name: "ExaSearchBot", operator: "exa", class: "bot", behaviour: "search", surface: "crawler", operatorType: "intermediary", verifiable: "signed", identify: { ua: ["ExaSearchBot", "ExaBot"], signatureAgent: ["crawler.exa.ai"] }, respectsRobots: true, source: "https://crawler.exa.ai" },
  { id: "parallel.shapbot", name: "ShapBot", operator: "parallel", class: "bot", behaviour: "search", surface: "crawler", operatorType: "intermediary", verifiable: "ip", identify: { ua: ["ShapBot", "Shap-User"], ipLists: [{ vendor: "parallel_shapbot", url: "https://docs.parallel.ai/resources/shapbot.json" }] }, respectsRobots: true, source: "https://docs.parallel.ai" },
  { id: "linkup.linkupbot", name: "LinkupBot", operator: "linkup", class: "bot", behaviour: "search", surface: "crawler", operatorType: "intermediary", verifiable: "ip", identify: { ua: ["LinkupBot"], ipLists: [{ vendor: "linkup", url: "https://linkup.so/linkupbot-ips.txt" }] }, respectsRobots: true, source: "https://linkup.so/bot" },
  { id: "phind.phindbot", name: "PhindBot", operator: "phind", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "declared", identify: { ua: ["PhindBot"] }, source: CUA },
  { id: "moonshot.kimi-user", name: "Kimi-User", operator: "moonshot", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "declared", identify: { ua: ["Kimi-User", "Kimi-SearchBot"] }, source: AIROBOTS },
  { id: "kagi.fetcher", name: "Kagi fetcher", operator: "kagi", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "declared", identify: { ua: ["kagi-fetcher"] }, source: AIROBOTS },
  { id: "cursor.agent", name: "Cursor", operator: "cursor", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "signed", identify: { signatureAgent: ["cursorusercontent.com"] }, source: WBA_REGISTRY },
  { id: "anthropic.claude-code", name: "Claude Code", operator: "anthropic", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "ip", family: "claude", identify: { ua: ["claude-code", "Claude-Code"], ipLists: ANTHROPIC_IPS }, source: CUA },
  { id: "google.gemini-cli", name: "Gemini CLI", operator: "google", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "declared", family: "google", identify: { ua: ["Google-Gemini-CLI", "GeminiCLI"] }, source: AIROBOTS },
  { id: "cognition.devin", name: "Devin", operator: "cognition", class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary", verifiable: "declared", identify: { ua: ["Devin"] }, source: AIROBOTS },
  { id: "klaviyo.aibot", name: "KlaviyoAIBot", operator: "klaviyo", class: "bot", behaviour: "data_collection", surface: "crawler", operatorType: "direct", verifiable: "signed", identify: { ua: ["KlaviyoAIBot"] }, source: WBA_REGISTRY },
  ...[
    ["addsearch.addsearchbot", "AddSearchBot", "addsearch", ["AddSearchBot"]],
    ["lyrenth.aiwebindex", "AIWebIndex", "lyrenth", ["AIWebIndex"]],
    ["andi.andibot", "Andibot", "andi", ["Andibot"]],
    ["direqt.anomura", "Anomura", "direqt", ["Anomura"]],
    ["aranet.searchbot", "Aranet-SearchBot", "aranet", ["Aranet-SearchBot"]],
    ["microsoft.azureai-searchbot", "AzureAI-SearchBot", "microsoft", ["AzureAI-SearchBot"]],
    ["channel3.bot", "Channel3Bot", "channel3", ["Channel3Bot"]],
    ["iask.bot", "iAsk", "iask", ["iAskBot", "iaskspider"]],
    ["querit.bot", "Querit", "querit", ["Querit-SearchBot", "QueritBot"]],
    ["zanista.bot", "ZanistaBot", "zanista", ["ZanistaBot"]]
  ].map(([id, name, op, ua]) => declared(id, name, op, [...ua], { behaviour: "search" })),
  ...[
    ["liner.linerbot", "LinerBot", "liner", ["LinerBot"]],
    ["mozilla.tabstack", "Mozilla Tabstack", "mozilla", ["Mozilla-Tabstack"]],
    ["sst.opencode", "opencode", "sst", ["opencode"]],
    ["geisthaus.pagefetcher", "GeistHaus PageFetcher", "geisthaus", ["GeistHaus-PageFetcher"]],
    ["poggio.citations", "Poggio-Citations", "poggio", ["Poggio-Citations"]],
    ["qualified.bot", "QualifiedBot", "qualified", ["QualifiedBot"]],
    ["useai.agent", "UseAI", "useai", ["UseAI"]],
    ["buddybot.agent", "BuddyBot", "buddybot", ["BuddyBot"]],
    ["wrtn.bot", "WRTNBot", "wrtn", ["WRTNBot"]],
    ["quantumcloud.wpbot", "wpbot", "quantumcloud", ["wpbot"]]
  ].map(([id, name, op, ua]) => declared(id, name, op, [...ua], { class: "agent", behaviour: "agent", surface: "user_fetch", operatorType: "intermediary" })),
  declared("amazon.ai-services", "Amazon AI services (Kendra, Q Business, Bedrock)", "amazon", ["amazon-kendra", "amazon-QBusiness", "bedrockbot"], { behaviour: "data_collection", operatorType: "intermediary", family: "amazon" }),
  { id: "cloudflare.ai-search", name: "Cloudflare AI Search", operator: "cloudflare", class: "bot", behaviour: "search", surface: "crawler", operatorType: "intermediary", verifiable: "signed", identify: { ua: ["Cloudflare-AI-Search", "Cloudflare-AutoRAG"] }, source: RADAR }
];
var aiCrawlers = [
  { id: "openai.gptbot", name: "GPTBot", operator: "openai", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "openai", identify: { ua: ["GPTBot"], ipLists: [{ vendor: "openai_gptbot", url: "https://openai.com/gptbot.json" }] }, robotsToken: "GPTBot", respectsRobots: true, docsUrl: OAI, source: OAI },
  { id: "anthropic.claudebot", name: "ClaudeBot", operator: "anthropic", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "claude", identify: { ua: ["ClaudeBot", "Claude-Web", "anthropic-ai"], ipLists: ANTHROPIC_IPS }, robotsToken: "ClaudeBot", respectsRobots: true, docsUrl: ANT, source: ANT },
  { id: "google.googleother", name: "GoogleOther", operator: "google", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "google", identify: { ua: ["GoogleOther(?:-Image|-Video)?", "Google-CloudVertexBot", "CloudVertexBot", "Google-Extended"], ipLists: GOOGLE_COMMON_IPS, rdns: GOOGLE_RDNS }, robotsToken: "Google-Extended", respectsRobots: true, docsUrl: GOOG_COMMON, source: GOOG_COMMON },
  { id: "meta.externalagent", name: "Meta-ExternalAgent", operator: "meta", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "signed", identify: { ua: ["meta-externalagent", "FacebookBot"], signatureAgent: ["www.meta.com"] }, robotsToken: "meta-externalagent", respectsRobots: true, docsUrl: META, source: META },
  { id: "bytedance.bytespider", name: "Bytespider", operator: "bytedance", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "declared", identify: { ua: ["Bytespider", "TikTokSpider", "DoubaoBot"] }, robotsToken: "Bytespider", respectsRobots: false, source: AIROBOTS },
  { id: "amazon.amazonbot", name: "Amazonbot", operator: "amazon", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "declared", family: "amazon", identify: { ua: ["Amazonbot"] }, robotsToken: "Amazonbot", respectsRobots: true, docsUrl: AMZ, source: AMZ },
  { id: "commoncrawl.ccbot", name: "CCBot", operator: "commoncrawl", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "ip", identify: { ua: ["CCBot"], ipLists: [{ vendor: "ccbot", url: "https://index.commoncrawl.org/ccbot.json" }], rdns: [".crawl.commoncrawl.org"] }, robotsToken: "CCBot", respectsRobots: true, source: "https://commoncrawl.org/ccbot" },
  { id: "brightdata.brightbot", name: "Brightbot", operator: "brightdata", class: "bot", behaviour: "data_collection", surface: "crawler", operatorType: "direct", verifiable: "declared", identify: { ua: ["Brightbot"] }, source: "https://brightdata.com/brightbot" },
  { id: "mistral.training", name: "MistralAI-Training", operator: "mistral", class: "bot", behaviour: "training", surface: "crawler", operatorType: "direct", verifiable: "declared", identify: { ua: ["MistralAI-Training"] }, respectsRobots: true, docsUrl: MISTRAL, source: MISTRAL },
  declared("cohere.crawler", "Cohere", "cohere", ["cohere-training-data-crawler", "cohere-ai"]),
  declared("diffbot.diffbot", "Diffbot", "diffbot", ["Diffbot", "Diffbot-User"], { behaviour: "data_collection", operatorType: "intermediary" }),
  declared("allenai.ai2bot", "AI2Bot", "allenai", ["AI2Bot", "Ai2Bot-Dolma", "AI2Bot-DeepResearchEval"], { respectsRobots: true }),
  declared("timpi.timpibot", "Timpibot", "timpi", ["Timpibot"]),
  declared("webz.omgili", "Webz.io (omgili)", "webz", ["omgili", "omgilibot", "webzio-extended"], { behaviour: "data_collection", respectsRobots: true }),
  declared("hive.imagesiftbot", "ImagesiftBot", "hive", ["ImagesiftBot"], { behaviour: "data_collection", respectsRobots: true }),
  declared("huawei.petalbot", "PetalBot", "huawei", ["PetalBot", "PanguBot"], { behaviour: "search", respectsRobots: true, source: RADAR }),
  declared("deepseek.deepseekbot", "DeepSeekBot", "deepseek", ["DeepSeekBot"], { respectsRobots: false }),
  declared("xai.grok", "Grok", "xai", ["GrokBot", "xAI-Grok", "Grok-DeepSearch", "GrokAgent"], { source: RADAR }),
  declared("moonshot.kimibot", "KimiBot", "moonshot", ["KimiBot"]),
  declared("alibaba.qwen", "Qwen", "alibaba", ["QwenBot", "TongyiBot"]),
  declared("baidu.ernie", "ERNIE", "baidu", ["ERNIEBot", "YiyanBot"]),
  declared("zhipu.chatglm", "ChatGLM-Spider", "zhipu", ["ChatGLM-Spider"]),
  declared("yandex.additional", "YandexAdditional", "yandex", ["YandexAdditional(?:Bot)?"], { verifiable: "rdns", identify: { ua: ["YandexAdditional(?:Bot)?"], rdns: [".yandex.ru", ".yandex.net", ".yandex.com"] }, respectsRobots: true }),
  declared("kangaroo.bot", "Kangaroo Bot", "kangaroo", ["Kangaroo Bot"], { source: CUA }),
  declared("rois.cotoyogi", "Cotoyogi", "rois", ["Cotoyogi"], { respectsRobots: true, source: RADAR }),
  declared("nict.icc-crawler", "ICC-Crawler", "nict", ["ICC-Crawler"], { respectsRobots: true, source: RADAR }),
  declared("softbank.sbintuitions", "SBIntuitionsBot", "softbank", ["SBIntuitionsBot"], { respectsRobots: true }),
  declared("laion.img2dataset", "img2dataset", "laion", ["img2dataset", "LAIONDownloader", "laion-huggingface-processor"], { behaviour: "data_collection", source: "https://github.com/rom1504/img2dataset" }),
  ...[
    ["panscient", "Panscient", ["panscient"]],
    ["velen", "Velen", ["VelenPublicWebCrawler"]],
    ["aihit", "aiHitBot", ["aiHitBot"]],
    ["factset", "FactSet", ["Factset_spyderbot"]],
    ["iss", "ISS Cyber Risk", ["ISSCyberRiskCrawler"]],
    ["sidetrade", "Sidetrade", ["Sidetrade indexer bot"]],
    ["netestate", "netEstate", ["netEstate Imprint Crawler"]],
    ["awario", "Awario", ["Awario(?:Bot|SmartBot|RssBot)?"]],
    ["brandwatch", "Brandwatch", ["magpie-crawler"]],
    ["echobox", "Echobox", ["EchoboxBot", "Echobot Bot"]],
    ["meltwater", "Meltwater", ["YaK"]],
    ["quillbot", "QuillBot", ["QuillBot"]],
    ["linguee", "Linguee", ["Linguee Bot"]],
    ["atlassian", "Atlassian", ["atlassian-bot"]],
    ["bigsur", "bigsur.ai", ["bigsur\\.ai"]],
    ["poseidon", "Poseidon", ["Poseidon Research Crawler"]],
    ["crawlspace", "Crawlspace", ["Crawlspace"]],
    ["wardbot", "WARDBot", ["WARDBot"]],
    ["friendlycrawler", "FriendlyCrawler", ["FriendlyCrawler"]],
    ["cragsoftware", "CragCrawler", ["CragCrawler"]],
    ["datenbank", "Datenbank Crawler", ["Datenbank Crawler"]],
    ["henkbot", "HenkBot", ["HenkBot"]],
    ["imagespider", "imageSpider", ["imageSpider"]],
    ["kunato", "KunatoCrawler", ["KunatoCrawler"]],
    ["mycentralai", "MyCentralAIScraperBot", ["MyCentralAIScraperBot"]],
    ["naget", "NagetBot", ["NagetBot"]],
    ["newsai", "newsai", ["newsai"]],
    ["reflection", "Reflectionbot", ["Reflectionbot"]],
    ["ceramic", "TerraCotta (Ceramic)", ["TerraCotta", "Terra Cotta"]],
    ["thinkbot", "Thinkbot", ["Thinkbot"]],
    ["agenttimes", "AgentTimes", ["AgentTimes"]]
  ].map(([op, name, ua]) => declared(`${op}.crawler`, name, op, [...ua], { behaviour: "data_collection" }))
];
var search = [
  { id: "google.googlebot", name: "Googlebot", operator: "google", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "google", identify: { ua: ["Googlebot(?:-Image|-Video|-News)?", "Storebot-Google", "Google-InspectionTool"], ipLists: GOOGLE_COMMON_IPS, rdns: GOOGLE_RDNS }, robotsToken: "Googlebot", respectsRobots: true, docsUrl: GOOG_COMMON, source: GOOG_COMMON },
  { id: "google.adsbot", name: "AdsBot-Google", operator: "google", class: "bot", behaviour: "ads_verification", surface: "crawler", operatorType: "direct", verifiable: "ip", family: "google", identify: { ua: ["AdsBot-Google(?:-Mobile)?", "Mediapartners-Google", "APIs-Google", "Google-Safety"], ipLists: [{ vendor: "google_special", url: `${GIP}/special-crawlers.json` }], rdns: GOOGLE_RDNS }, respectsRobots: true, docsUrl: GOOG_SPECIAL, source: GOOG_SPECIAL },
  { id: "microsoft.bingbot", name: "Bingbot", operator: "microsoft", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", identify: { ua: ["bingbot", "adidxbot", "BingPreview", "MicrosoftPreview"], ipLists: [{ vendor: "bingbot", url: "https://www.bing.com/toolbox/bingbot.json" }], rdns: [".search.msn.com"] }, robotsToken: "bingbot", respectsRobots: true, source: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0" },
  { id: "apple.applebot", name: "Applebot", operator: "apple", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", identify: { ua: ["Applebot"], ipLists: [{ vendor: "applebot", url: "https://search.developer.apple.com/applebot.json" }], rdns: [".applebot.apple.com"] }, robotsToken: "Applebot-Extended", respectsRobots: true, source: "https://support.apple.com/en-us/119829" },
  { id: "duckduckgo.duckduckbot", name: "DuckDuckBot", operator: "duckduckgo", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "ip", identify: { ua: ["DuckDuckBot"], ipLists: [{ vendor: "duckduckbot", url: "https://duckduckgo.com/duckduckbot.json" }] }, respectsRobots: true, source: "https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot" },
  { id: "yandex.yandexbot", name: "YandexBot", operator: "yandex", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "rdns", identify: { ua: ["YandexBot", "YandexImages", "YandexMobileBot"], rdns: [".yandex.ru", ".yandex.net", ".yandex.com"] }, respectsRobots: true, source: "https://yandex.com/support/webmaster/en/robot-workings/check-yandex-robots" },
  { id: "baidu.baiduspider", name: "Baiduspider", operator: "baidu", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "rdns", identify: { ua: ["Baiduspider(?:-image|-video|-news|-favo|-cpro|-ads)?"], rdns: [".baidu.com", ".baidu.jp"] }, respectsRobots: true, source: "https://help.baidu.com/question?prod_id=99&class=476&id=2996" },
  { id: "seznam.seznambot", name: "SeznamBot", operator: "seznam", class: "bot", behaviour: "search", surface: "crawler", operatorType: "direct", verifiable: "rdns", identify: { ua: ["SeznamBot"], rdns: [".seznam.cz"] }, respectsRobots: true, source: "https://o-seznam.cz/napoveda/vyhledavani/en/seznambot-crawler/" },
  declared("yahoo.slurp", "Yahoo Slurp", "yahoo", ["Yahoo! Slurp"], { behaviour: "search", respectsRobots: true, source: RADAR }),
  declared("sogou.spider", "Sogou spider", "sogou", ["Sogou (?:web|pic|news) spider"], { behaviour: "search", respectsRobots: true, source: CUA }),
  declared("naver.yeti", "Yeti (Naver)", "naver", ["Yeti"], { behaviour: "search", respectsRobots: true, source: RADAR }),
  declared("qwant.qwantbot", "Qwantbot", "qwant", ["Qwantbot", "Qwantify"], { behaviour: "search", respectsRobots: true, source: CUA }),
  declared("mojeek.mojeekbot", "MojeekBot", "mojeek", ["MojeekBot"], { behaviour: "search", respectsRobots: true, source: CUA }),
  declared("coccoc.coccocbot", "coccocbot", "coccoc", ["coccocbot(?:-web|-image)?"], { behaviour: "search", respectsRobots: true, source: CUA }),
  declared("brave.bravebot", "Bravebot", "brave", ["Bravebot"], { behaviour: "search", respectsRobots: true, source: RADAR }),
  declared("seekport.seekportbot", "SeekportBot", "seekport", ["SeekportBot"], { behaviour: "search", source: CUA }),
  declared("qihoo.360spider", "360Spider", "qihoo", ["360Spider"], { behaviour: "search", source: CUA })
];
var seo = [
  { id: "ahrefs.ahrefsbot", name: "AhrefsBot", operator: "ahrefs", class: "bot", behaviour: "seo", surface: "crawler", operatorType: "direct", verifiable: "ip", identify: { ua: ["AhrefsBot", "AhrefsSiteAudit"], ipLists: [{ vendor: "ahrefs", url: "https://api.ahrefs.com/v3/public/crawler-ip-ranges" }], rdns: [".ahrefs.com", ".ahrefs.net"] }, respectsRobots: true, source: "https://ahrefs.com/robot" },
  declared("semrush.semrushbot", "SemrushBot", "semrush", ["SemrushBot(?:-[A-Za-z]+)?", "SiteAuditBot"], { behaviour: "seo", respectsRobots: true, source: "https://www.semrush.com/bot/" }),
  declared("majestic.mj12bot", "MJ12bot", "majestic", ["MJ12bot"], { behaviour: "seo", respectsRobots: true, source: RADAR }),
  declared("moz.dotbot", "DotBot / rogerbot", "moz", ["DotBot", "rogerbot"], { behaviour: "seo", respectsRobots: true, source: RADAR }),
  declared("dataforseo.bot", "DataForSeoBot", "dataforseo", ["DataForSeoBot"], { behaviour: "seo", respectsRobots: true, source: RADAR }),
  declared("webmeup.blexbot", "BLEXBot", "webmeup", ["BLEXBot"], { behaviour: "seo", respectsRobots: true, source: RADAR }),
  declared("babbar.barkrowler", "Barkrowler", "babbar", ["Barkrowler"], { behaviour: "seo", respectsRobots: true, source: RADAR }),
  declared("seokicks.bot", "SEOkicks", "seokicks", ["SEOkicks"], { behaviour: "seo", respectsRobots: true, source: CUA }),
  declared("screamingfrog.spider", "Screaming Frog", "screamingfrog", ["Screaming Frog SEO Spider"], { behaviour: "seo", operatorType: "intermediary", source: CUA }),
  declared("sitebulb.crawler", "Sitebulb", "sitebulb", ["Sitebulb"], { behaviour: "seo", operatorType: "intermediary", source: CUA }),
  declared("serpstat.bot", "serpstatbot", "serpstat", ["serpstatbot"], { behaviour: "seo", source: CUA }),
  declared("seranking.bot", "SE Ranking", "seranking", ["SERankingBacklinksBot"], { behaviour: "seo", source: CUA }),
  declared("brightedge.crawler", "BrightEdge", "brightedge", ["BrightEdge Crawler"], { behaviour: "seo", source: CUA }),
  declared("siteimprove.crawler", "Siteimprove", "siteimprove", ["Siteimprove"], { behaviour: "seo", source: CUA })
];
var preview = (id, name, operator, ua, source = RADAR) => declared(id, name, operator, ua, { behaviour: "link_preview", surface: "user_fetch", source });
var monitor = (id, name, operator, ua, ipUrl) => ({
  ...declared(id, name, operator, ua, { behaviour: "monitoring", operatorType: "intermediary", source: RADAR }),
  ...ipUrl ? { verifiable: "ip", identify: { ua, ipLists: [{ vendor: operator, url: ipUrl }] } } : {}
});
var social = [
  preview("meta.facebookexternalhit", "facebookexternalhit", "meta", ["facebookexternalhit", "meta-externalads"], META),
  preview("x.twitterbot", "Twitterbot", "x", ["Twitterbot"]),
  preview("linkedin.linkedinbot", "LinkedInBot", "linkedin", ["LinkedInBot"]),
  preview("slack.slackbot", "Slackbot", "slack", ["Slackbot(?:-LinkExpanding)?", "Slack-ImgProxy"]),
  preview("discord.discordbot", "Discordbot", "discord", ["Discordbot"]),
  preview("telegram.telegrambot", "TelegramBot", "telegram", ["TelegramBot"]),
  preview("meta.whatsapp", "WhatsApp", "meta", ["^WhatsApp/[0-9.]+"], CUA),
  { ...preview("pinterest.pinterestbot", "Pinterestbot", "pinterest", ["Pinterestbot"], "https://help.pinterest.com/en/business/article/pinterest-crawler"), verifiable: "rdns", identify: { ua: ["Pinterestbot"], rdns: [".pinterest.com", ".pinterestcrawler.com"] } },
  preview("reddit.redditbot", "redditbot", "reddit", ["redditbot"], CUA),
  preview("snap.urlpreview", "Snap URL Preview", "snap", ["Snap URL Preview Service"], CUA),
  preview("iframely.bot", "Iframely", "iframely", ["Iframely"], CUA),
  preview("embedly.bot", "Embedly", "embedly", ["Embedly"], CUA),
  monitor("uptimerobot.monitor", "UptimeRobot", "uptimerobot", ["UptimeRobot"], "https://uptimerobot.com/inc/files/ips/IPv4.txt"),
  monitor("pingdom.monitor", "Pingdom", "pingdom", ["Pingdom\\.com_bot", "PingdomPageSpeed"], "https://my.pingdom.com/probes/ipv4"),
  monitor("datadog.synthetics", "Datadog Synthetics", "datadog", ["DatadogSynthetics"], "https://ip-ranges.datadoghq.com/"),
  monitor("checkly.monitor", "Checkly", "checkly", ["Checkly"], "https://api.checklyhq.com/v1/static-ips"),
  monitor("statuscake.monitor", "StatusCake", "statuscake", ["StatusCake"]),
  monitor("site24x7.monitor", "Site24x7", "site24x7", ["Site24x7"]),
  monitor("betteruptime.monitor", "Better Stack", "betteruptime", ["BetterUptimeBot", "Better Uptime Bot"]),
  monitor("newrelic.synthetics", "New Relic Synthetics", "newrelic", ["NewRelicSynthetics"]),
  monitor("google.lighthouse", "Lighthouse", "google", ["Chrome-Lighthouse"]),
  monitor("webpagetest.ptst", "WebPageTest", "webpagetest", ["PTST"]),
  monitor("gtmetrix.monitor", "GTmetrix", "gtmetrix", ["GTmetrix"])
];
var tool = (id, name, operator, surface, identify, source, o = {}) => ({
  id,
  name,
  operator,
  class: "bot",
  behaviour: "data_collection",
  surface,
  operatorType: "intermediary",
  verifiable: identify.ua?.length ? "declared" : "stealth",
  identify,
  respectsRobots: "unknown",
  source,
  ...o
});
var scrapers = [
  tool("brightdata.unlocker", "Bright Data", "brightdata", "scraper_api", {}, "https://brightdata.com"),
  tool("oxylabs.api", "Oxylabs", "oxylabs", "scraper_api", {}, "https://oxylabs.io"),
  tool("scraperapi.api", "ScraperAPI", "scraperapi", "scraper_api", {}, "https://www.scraperapi.com"),
  tool("scrapingbee.api", "ScrapingBee", "scrapingbee", "scraper_api", {}, "https://www.scrapingbee.com"),
  tool("zenrows.api", "ZenRows", "zenrows", "scraper_api", {}, "https://www.zenrows.com"),
  tool("scrapfly.api", "Scrapfly", "scrapfly", "scraper_api", {}, "https://scrapfly.io"),
  tool("zyte.scrapy", "Scrapy / Zyte", "zyte", "scraper_api", { ua: ["Scrapy"] }, "https://github.com/scrapy/scrapy/blob/master/scrapy/settings/default_settings.py"),
  tool("apify.crawlee", "Apify / Crawlee", "apify", "scraper_api", { ua: ["ApifyBot", "ApifyWebsiteContentCrawler"], signatureAgent: ["api.apify.com"] }, "https://docs.apify.com", { verifiable: "signed" }),
  tool("firecrawl.api", "Firecrawl", "firecrawl", "scraper_api", { ua: ["FirecrawlAgent"] }, "https://github.com/mendableai/firecrawl", { robotsToken: "FirecrawlAgent", respectsRobots: true }),
  tool("jina.reader", "Jina Reader", "jina", "scraper_api", {}, "https://github.com/jina-ai/reader"),
  tool("tavily.api", "Tavily", "tavily", "scraper_api", { ua: ["TavilyBot"] }, "https://docs.tavily.com/documentation/search-crawler"),
  tool("serpapi.api", "SerpApi", "serpapi", "scraper_api", {}, "https://serpapi.com"),
  tool("crawl4ai.crawler", "Crawl4AI", "crawl4ai", "scraper_api", { ua: ["Crawl4AI"] }, "https://github.com/unclecode/crawl4ai"),
  tool("lightpanda.browser", "Lightpanda", "lightpanda", "automation_tool", { ua: ["Lightpanda"] }, "https://github.com/lightpanda-io/browser"),
  tool("chrome.headless", "Headless Chrome", "chrome", "automation_tool", { ua: ["HeadlessChrome"] }, "https://developer.chrome.com/docs/chromium/headless"),
  ...[
    ["python.requests", "python-requests", "python", ["python-requests"]],
    ["python.httpx", "python-httpx", "python", ["python-httpx"]],
    ["python.urllib", "Python-urllib", "python", ["Python-urllib"]],
    ["python.aiohttp", "aiohttp", "python", ["aiohttp"]],
    ["go.http-client", "Go-http-client", "go", ["Go-http-client"]],
    ["square.okhttp", "okhttp", "square", ["okhttp"]],
    ["curl.curl", "curl", "curl", ["curl/[0-9]"]],
    ["gnu.wget", "Wget", "gnu", ["Wget"]],
    ["axios.axios", "axios", "axios", ["axios/[0-9]"]],
    ["node.fetch", "node-fetch", "node", ["node-fetch", "undici"]],
    ["apache.httpclient", "Apache-HttpClient", "apache", ["Apache-HttpClient"]]
  ].map(([id, name, op, ua]) => tool(id, name, op, "http_library", { ua: [...ua] }, CUA))
];
var CATALOG = [...fingerprinted, ...agents, ...aiFetch, ...aiCrawlers, ...search, ...seo, ...social, ...scrapers];

// ../core/src/catalog/rules.ts
var markerRules = () => FINGERPRINTS.flatMap((f) => (f.markers ?? []).map((m2) => ({
  selector: m2.selector,
  family: f.family ?? "unknown",
  agentId: f.id,
  target: m2.target ?? f.class,
  code: m2.code,
  ...m2.llr !== void 0 ? { llr: m2.llr } : {}
})));
var globalRules = () => FINGERPRINTS.flatMap((f) => (f.globals ?? []).map((g2) => ({
  pattern: g2.pattern,
  target: g2.target ?? f.class,
  code: g2.code,
  agentId: f.id,
  ...f.family ? { family: f.family } : {}
})));

// ../core/src/catalog/index.ts
var byId = new Map(CATALOG.map((e2) => [e2.id, e2]));
var compiled = CATALOG.flatMap(
  (entry) => (entry.identify.ua ?? []).map((src) => ({ entry, re: new RegExp(`(?:^|[^A-Za-z0-9-])(${src})(?=$|[^A-Za-z0-9-])`, "i") }))
);

// ../core/src/signatures.ts
var base = {
  pageview: { tagOnly: true },
  search: { challengeAt: 0.85 },
  login: { challengeAt: 0.6, denyAt: 0.9, stepUp: true },
  signup: { challengeAt: 0.5, denyAt: 0.85 },
  password_reset: { challengeAt: 0.6, denyAt: 0.9 },
  add_to_cart: { challengeAt: 0.9 },
  checkout: { challengeAt: 0.8 },
  payment: { challengeAt: 0.8 },
  gift_card: { challengeAt: 0.5, denyAt: 0.85 },
  promo: { challengeAt: 0.6, denyAt: 0.9 },
  post: { challengeAt: 0.7, denyAt: 0.95 },
  message: { challengeAt: 0.7, denyAt: 0.95 },
  lead_form: { challengeAt: 0.7 },
  api_key: { challengeAt: 0.6, denyAt: 0.9 }
};
var withOverrides = (o) => ({ ...base, ...o });
var policies = {
  generic: base,
  saas: withOverrides({ login: { challengeAt: 0.7, denyAt: 0.95, stepUp: true } }),
  ecommerce: withOverrides({ checkout: { challengeAt: 0.85 }, add_to_cart: { challengeAt: 0.9 } }),
  content: withOverrides({ pageview: { tagOnly: true }, search: { tagOnly: true } }),
  social: withOverrides({ signup: { challengeAt: 0.45, denyAt: 0.85 } }),
  payments: withOverrides({ payment: { challengeAt: 0.75 } }),
  fintech: withOverrides({ login: { challengeAt: 0.5, denyAt: 0.85, stepUp: true } }),
  ticketing: withOverrides({ add_to_cart: { challengeAt: 0.6, denyAt: 0.9 }, checkout: { challengeAt: 0.6, denyAt: 0.9 } }),
  leadgen: withOverrides({ lead_form: { challengeAt: 0.75 } }),
  // Public-service sites: never auto-deny (accessibility + legal access).
  gov: Object.fromEntries(Object.keys(base).map((k) => [k, { tagOnly: true }]))
};
var DEFAULT_SIGNATURES = {
  version: "2026.09.4",
  priors: {
    generic: { bot: 0.2, agent: 0.03 },
    saas: { bot: 0.15, agent: 0.04 },
    ecommerce: { bot: 0.2, agent: 0.03 },
    content: { bot: 0.35, agent: 0.03 },
    social: { bot: 0.25, agent: 0.04 },
    payments: { bot: 0.1, agent: 0.02 },
    fintech: { bot: 0.25, agent: 0.02 },
    ticketing: { bot: 0.4, agent: 0.02 },
    leadgen: { bot: 0.15, agent: 0.02 },
    gov: { bot: 0.2, agent: 0.02 }
  },
  actionPriorBoost: { signup: 1.6, login: 1.4, gift_card: 2, promo: 1.4, add_to_cart: 1.2, lead_form: 1.3 },
  groupCaps: { A: 12, E: 4, D: 6, R: 3, C: 3, H: 6, J: 3 },
  markers: markerRules(),
  globals: globalRules(),
  policies,
  judgeBand: [0.25, 0.75]
};

// ../identity/src/reference.ts
var ETHEREUM_REGISTRIES = {
  chain_id: "1",
  identity: "0x8004a169fb4a3325136eb29fa0ceb6d2e539a432",
  reputation: "0x8004baa17c55a88189ae136b182e5fda19de9b63"
};
var IdentityInputError = class extends Error {
};
function uintString(value, name, positive = false) {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]{0,77})$/.test(value) || BigInt(value) >= 2n ** 256n || positive && value === "0")
    throw new IdentityInputError(`${name} must be a canonical ${positive ? "positive " : ""}decimal string (uint256).`);
  return value;
}
function address(value, name = "registry_address") {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(value) || /^0x0{40}$/i.test(value))
    throw new IdentityInputError(`${name} must be a nonzero Ethereum address.`);
  return value.toLowerCase();
}
function agentName(value) {
  if (typeof value !== "string" || value.length > 128 || !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/.test(value))
    throw new IdentityInputError("agent_name must follow operator.agent-name, for example acme.shopping-assistant.");
  return value;
}
function agentReference(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new IdentityInputError("Agent identity must be an object.");
  const agent_name = agentName(raw.agent_name);
  const chain_id = uintString(raw.chain_id ?? "1", "chain_id", true);
  if (raw.registry_address === void 0 && chain_id !== "1") throw new IdentityInputError("Supply registry_address for this chain.");
  const registry_address = address(raw.registry_address ?? ETHEREUM_REGISTRIES.identity);
  const token_id = uintString(raw.token_id, "token_id");
  return { agent_name, chain_id, registry_address, token_id, agent_ref: `eip155:${chain_id}:${registry_address}:${token_id}` };
}
function reputationQuery(raw, reference) {
  if (raw.reviewers === void 0 || Array.isArray(raw.reviewers) && raw.reviewers.length === 0) return null;
  if (!Array.isArray(raw.reviewers) || raw.reviewers.length > 5) throw new IdentityInputError("reviewers must contain 1\u20135 trusted reviewer addresses.");
  const reviewers = [...new Set(raw.reviewers.map((v) => address(v, "reviewer")))];
  const registry = raw.reputation_registry ?? (reference.chain_id === "1" && reference.registry_address === ETHEREUM_REGISTRIES.identity ? ETHEREUM_REGISTRIES.reputation : void 0);
  const tags = [raw.tag1 ?? "", raw.tag2 ?? ""];
  if (tags.some((v) => typeof v !== "string" || v.length > 128)) throw new IdentityInputError("Reputation tags must be strings of at most 128 characters.");
  return { registry_address: address(registry, "reputation_registry"), reviewers, tag1: tags[0], tag2: tags[1] };
}

// ../identity/src/user-agent.ts
var TOKEN = /^[!#$%&'*+.^_`|~0-9a-z-]+$/i;
var AGENT_UA_MAX = 1024;
function agentUserAgent(name, ref) {
  const agent = agentName(name);
  if (!ref) return `${agent}/1.0`;
  const reference = parseReference(agent, ref);
  return `${agent}/1.0 (erc8004=${reference.agent_ref})`;
}
function parseReference(name, ref) {
  const parts = ref.split(":");
  if (parts.length !== 4 || parts[0] !== "eip155") throw new IdentityInputError("Invalid ERC-8004 reference.");
  return agentReference({ agent_name: name, chain_id: parts[1], registry_address: parts[2], token_id: parts[3] });
}
function parseAgentUserAgent(ua) {
  if (!ua || ua.length > AGENT_UA_MAX || /[^\x20-\x7e\t]/.test(ua)) return null;
  let pos = 0;
  const products = [];
  while (pos < ua.length) {
    while (/[ \t]/.test(ua[pos] ?? "") && pos < ua.length) pos++;
    if (pos === ua.length) break;
    if (ua[pos] === "(") {
      if (!products.length) return null;
      const start = ++pos;
      let depth = 1;
      while (pos < ua.length && depth) {
        if (ua[pos] === "\\") {
          pos += 2;
          continue;
        }
        if (ua[pos] === "(") depth++;
        if (ua[pos] === ")") depth--;
        pos++;
      }
      if (depth || pos < ua.length && !/[ \t]/.test(ua[pos])) return null;
      products[products.length - 1].comments.push(ua.slice(start, pos - 1));
    } else {
      const start = pos;
      while (pos < ua.length && !/[ \t]/.test(ua[pos])) pos++;
      const [name2, version3, extra] = ua.slice(start, pos).split("/");
      if (!TOKEN.test(name2) || version3 !== void 0 && !TOKEN.test(version3) || extra !== void 0) return null;
      products.push({ name: name2, comments: [] });
    }
  }
  const candidates = products.filter(({ name: name2 }) => {
    try {
      agentName(name2);
      return true;
    } catch {
      return false;
    }
  });
  if (candidates.length !== 1) return null;
  const [{ name, comments }] = candidates;
  const references = comments.filter((comment) => /erc8004/i.test(comment));
  if (references.length > 1) return null;
  let reference;
  if (references.length) {
    const match = /^erc8004=(eip155:[^\s()]+)$/.exec(references[0]);
    if (!match) return null;
    try {
      reference = parseReference(name, match[1]);
    } catch {
      return null;
    }
  }
  return {
    agent_name: name,
    agent_ref: reference?.agent_ref ?? null,
    chain_id: reference?.chain_id ?? null,
    registry_address: reference?.registry_address ?? null,
    token_id: reference?.token_id ?? null,
    source: "user-agent",
    verification: "declared"
  };
}

// src/simulation/options.ts
var SITE_SCENARIOS = ["observe", "bot", "agent"];
var SIMULATED_AGENTS = CATALOG.filter((entry) => entry.class === "agent" && FIXTURES.some((fixture) => fixture.catalogId === entry.id)).map(({ id, name }) => ({ id, name }));
var SITE_PROFILES = Object.keys(DEFAULT_SIGNATURES.priors);
function siteUrl(value) {
  if (typeof value !== "string" || value.length > 2048) throw new Error("Enter an http:// or https:// website URL.");
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter a complete URL, including https://.");
  }
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname || url.username || url.password)
    throw new Error("Use an HTTP(S) website URL without embedded credentials.");
  url.hash = "";
  return url.href;
}
function integer(raw, name, fallback, min, max) {
  if (raw === void 0) return fallback;
  if (!/^[0-9]+$/.test(String(raw)) || !Number.isSafeInteger(Number(raw)) || Number(raw) < min || Number(raw) > max)
    throw new Error(`${name} must be a whole number from ${min} to ${max}.`);
  return Number(raw);
}
function siteOptions(raw) {
  const scenario = raw.scenario ?? "observe";
  if (!SITE_SCENARIOS.includes(scenario)) throw new Error("scenario must be observe, bot or agent.");
  const evidence = raw.evidence ?? "behavior";
  if (evidence !== "behavior" && evidence !== "marker") throw new Error("evidence must be behavior or marker.");
  const agent = raw.agent ?? "browser-use.agent";
  if (!SIMULATED_AGENTS.some((entry) => entry.id === agent)) throw new Error("Choose an agent with a browser fixture (use --list).");
  const profile = raw.profile ?? "generic";
  if (!SITE_PROFILES.includes(profile)) throw new Error("Unknown site profile.");
  const duration = integer(raw.duration, "duration (seconds)", 20, 2, 120);
  const delay = integer(raw.delay, "delay (milliseconds)", 1500, 0, 6e4);
  if (delay >= duration * 1e3) throw new Error("delay must be shorter than duration.");
  if (raw.userAgent !== void 0 && (typeof raw.userAgent !== "string" || !raw.userAgent.trim() || raw.userAgent.length > 512 || /[\r\n]/.test(raw.userAgent)))
    throw new Error("user-agent must be a non-empty single line of at most 512 characters.");
  for (const key of ["report", "headed"]) if (raw[key] !== void 0 && typeof raw[key] !== "boolean") throw new Error(`${key} must be a boolean.`);
  let declaration;
  if (raw["agent-name"] !== void 0) {
    const name = agentName(raw["agent-name"]);
    const ref = raw["token-id"] === void 0 ? void 0 : agentReference({ agent_name: name, token_id: raw["token-id"], chain_id: raw["chain-id"], registry_address: raw.registry }).agent_ref;
    declaration = agentUserAgent(name, ref);
    if (raw.userAgent && (parseAgentUserAgent(raw.userAgent) || /erc8004=/i.test(raw.userAgent)))
      throw new Error("Use --agent-name for one declaration; do not also embed an identity in --user-agent.");
  }
  return {
    url: siteUrl(raw.url),
    scenario,
    evidence,
    agent,
    profile,
    duration,
    delay,
    scroll: integer(raw.scroll, "scroll (pixels)", 0, 0, 1200),
    interval: integer(raw.interval, "interval (milliseconds)", 1500, 250, 1e4),
    pause: integer(raw.pause, "pause (milliseconds)", scenario === "agent" ? 2200 : 350, 100, 1e4),
    ...raw.userAgent ? { userAgent: raw.userAgent } : {},
    report: raw.report === true,
    headed: raw.headed === true,
    ...declaration ? { declaration } : {}
  };
}
function siteFixture(options) {
  if (options.evidence !== "marker") return void 0;
  const id = options.scenario === "agent" ? options.agent : options.scenario === "bot" ? "playwright.automation" : void 0;
  return id ? FIXTURES.find((fixture) => fixture.catalogId === id) : void 0;
}

// src/simulation/run.ts
import { createRequire } from "node:module";
import { readFileSync as readFileSync3 } from "node:fs";
import { join as join3, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

// src/simulation/actions.ts
async function behaviorActions(page, options) {
  if (options.evidence !== "behavior" || options.scenario === "observe") return null;
  const id = `da-simulation-${crypto.randomUUID()}`;
  await page.evaluate((id2) => {
    const panel = document.createElement("section");
    panel.id = id2;
    panel.setAttribute("aria-label", "Double Agent simulation controls");
    panel.style.cssText = "position:fixed;inset:20px 20px auto auto;z-index:2147483647;width:300px;padding:16px;background:#fff;color:#111;border:2px solid #111;font:14px system-ui";
    panel.innerHTML = '<b>Double Agent behavior simulation</b><p>Temporary test controls. No site forms are submitted.</p><p role="status">Waiting for the first action\u2026</p><label>Test name<input autocomplete="off" type="text"></label><label>Test note<input autocomplete="off" type="text"></label><button type="button">Inspect sample</button><button type="button">Choose sample</button><button type="button">Complete sample</button>';
    panel.querySelectorAll("input,button").forEach((el) => {
      el.style.cssText = "display:block;box-sizing:border-box;width:260px;height:36px;margin:12px 0";
    });
    panel.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    document.body.appendChild(panel);
  }, id);
  const fields = page.locator(`#${id} input`), buttons = page.locator(`#${id} button`);
  let step = 0;
  return {
    async next() {
      const description = step < 2 ? `Entered text in ${step ? "Test note" : "Test name"}` : `Clicked ${["Inspect sample", "Choose sample", "Complete sample"][(step - 2) % 3]}`;
      if (step < 2) {
        await fields.nth(step).click({ timeout: 2e3 });
        if (options.scenario === "agent") await page.keyboard.insertText(step ? "Review sample" : "Example visitor");
        else await fields.nth(step).fill(step ? "Review sample" : "Example visitor", { timeout: 2e3 });
      } else await buttons.nth((step - 2) % 3).click({ timeout: 2e3 });
      step++;
      await page.locator(`#${id} [role="status"]`).evaluate((node, text) => {
        node.textContent = text;
      }, `Action ${step}: ${description}`);
      return description;
    },
    get count() {
      return step;
    }
  };
}

// src/simulation/telemetry.ts
function isCollection(url, method) {
  return method === "POST" && new URL(url).pathname === "/v1/collect";
}
var identifier = (value, max) => typeof value === "string" && value.length <= max && /^[a-z0-9._:-]+$/i.test(value) ? value : null;
function collectionReceipt(url, body, status, acceptedHeader, blocked = false) {
  const endpoint = new URL(url);
  let payload = null;
  try {
    if (body && body.length <= 131072) payload = JSON.parse(body);
  } catch {
  }
  const outcome = blocked ? "blocked" : status === null ? "failed" : status >= 200 && status < 300 && acceptedHeader !== "0" ? "accepted" : "rejected";
  const cls = payload?.verdict?.class;
  return {
    endpoint: endpoint.origin + endpoint.pathname,
    sessionId: identifier(payload?.sid, 128),
    siteHost: identifier(payload?.page?.host, 253),
    verdictClass: typeof cls === "string" && ["human", "bot", "agent"].includes(cls) ? cls : null,
    status,
    outcome,
    reason: blocked ? "isolated_mode" : status === null ? "network_error" : acceptedHeader === "0" ? "telemetry_not_accepted" : outcome === "rejected" ? "http_error" : null
  };
}

// src/simulation/run.ts
var exec = promisify(execFile);
var TELEMETRY = /\/v1\/(?:collect|check|ping|hits|evaluate)(?:\/|$)/;
function telemetryRequest(url) {
  return TELEMETRY.test(new URL(url).pathname);
}
function cleanTarget(url) {
  const parsed = new URL(url);
  return parsed.origin + parsed.pathname;
}
function playwrightRuntime(cwd) {
  if (Number(process.versions.node.split(".")[0]) < 20) throw new Error("Website simulation needs Node.js 20 or later.");
  for (const from of [import.meta.url, join3(cwd, "package.json")]) {
    try {
      const require2 = createRequire(from);
      const module = require2("playwright");
      return { ...module, cli: join3(dirname(require2.resolve("playwright/package.json")), "cli.js") };
    } catch {
    }
  }
  throw new Error("Playwright is unavailable. Install playwright@1.63.0 in this project, or use npx @doubleagent-so/cli simulate.");
}
async function installSimulationBrowser(cwd) {
  const { cli } = playwrightRuntime(cwd);
  await exec(process.execPath, [cli, "install", "chromium"], { maxBuffer: 8 * 1024 * 1024 });
}
async function runSiteSimulation(options, deps) {
  const chromium = deps.chromium ?? playwrightRuntime(deps.cwd).chromium;
  const source = deps.probeSource ?? readFileSync3(new URL("./simulation-probe.js", import.meta.url), "utf8");
  const fixture = siteFixture(options);
  const startedAt = (/* @__PURE__ */ new Date()).toISOString();
  const snapshots = [], errors = [];
  const actionLog = [], receipts = [];
  const pending = /* @__PURE__ */ new Set();
  let browser, context, page;
  let accepted = 0, blocked = 0, signed = 0, signFailed = 0;
  const cancel = () => {
    void context?.close().catch(() => {
    });
  };
  deps.signal?.throwIfAborted();
  deps.signal?.addEventListener("abort", cancel, { once: true });
  try {
    deps.onStatus?.(`Launching ${options.headed ? "visible" : "headless"} Chromium\u2026`);
    try {
      browser = await chromium.launch({ headless: !options.headed });
    } catch (error) {
      throw new Error(`Chromium could not start. Run doubleagent simulate --install-browser first. ${String(error)}`);
    }
    let userAgent = options.userAgent;
    if (options.declaration) {
      if (!userAgent) {
        const initial = await browser.newContext();
        try {
          userAgent = await (await initial.newPage()).evaluate(() => navigator.userAgent);
        } finally {
          await initial.close();
        }
      }
      userAgent = `${userAgent} ${options.declaration}`;
      if (userAgent.length > AGENT_UA_MAX) throw new Error("Combined User-Agent exceeds 1024 characters.");
    }
    context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      serviceWorkers: "block",
      ...userAgent ? { userAgent } : {}
    });
    deps.signal?.throwIfAborted();
    await context.route("**/*", async (route) => {
      if (!options.report && telemetryRequest(route.request().url())) {
        blocked++;
        await route.abort();
      } else if (deps.signRequest && options.report) {
        try {
          const req = route.request();
          const authenticated = await deps.signRequest(new Request(req.url(), {
            method: req.method(),
            headers: await req.allHeaders(),
            ...req.postDataBuffer() ? { body: new Uint8Array(req.postDataBuffer()) } : {}
          }));
          if (authenticated) {
            signed++;
            await route.continue({ headers: Object.fromEntries(authenticated.headers) });
          } else await route.continue();
        } catch {
          signFailed++;
          if (errors.length < 20) errors.push("Request signing failed; that request was blocked.");
          await route.abort();
        }
      } else await route.continue();
    });
    await context.addInitScript({ content: `window.__daSiteOptions=${JSON.stringify(options)};
${source}` });
    page = await context.newPage();
    page.on("pageerror", (error) => {
      if (errors.length < 20) errors.push(error.message.slice(0, 300));
    });
    const collect = (request, status, acceptedHeader) => {
      if (!isCollection(request.url(), request.method())) return;
      pending.delete(request);
      const receipt = collectionReceipt(request.url(), request.postData(), status, acceptedHeader, !options.report);
      if (receipt.outcome === "accepted") accepted++;
      if (receipts.length < 50) receipts.push(receipt);
      deps.onCollection?.(receipt);
    };
    page.on("request", (request) => {
      if (isCollection(request.url(), request.method())) pending.add(request);
    });
    page.on("requestfailed", (request) => collect(request, null));
    page.on("response", (response) => {
      collect(response.request(), response.status(), response.headers()["da-telemetry-accepted"]);
    });
    deps.onStatus?.(`Opening ${cleanTarget(options.url)}\u2026`);
    await page.goto(options.url, { waitUntil: "domcontentloaded", timeout: 3e4 });
    await page.waitForFunction(() => Boolean(window.__daSiteProbe), void 0, { timeout: 15e3 });
    await page.evaluate(() => window.__daSiteProbe.ready);
    const actions = await behaviorActions(page, options);
    deps.onStatus?.(`Page ready. Running ${options.scenario} / ${options.evidence} for ${options.duration}s${actions ? `, pausing ${options.pause}ms between actions` : ""}.`);
    const runningAt = Date.now();
    const until = Date.now() + options.duration * 1e3;
    let scrollAt = Date.now() + options.interval, actionAt = Date.now() + options.delay, previewAt = 0;
    while (Date.now() < until) {
      deps.signal?.throwIfAborted();
      const snapshot = await page.evaluate(() => window.__daSiteProbe.snapshot());
      snapshots.push(snapshot);
      let preview2;
      if (deps.previews && Date.now() >= previewAt) {
        preview2 = Buffer.from(await page.screenshot({ type: "jpeg", quality: 55, timeout: 5e3 })).toString("base64");
        previewAt = Date.now() + 2e3;
      }
      deps.onSnapshot?.(snapshot, preview2);
      if (actions && Date.now() >= actionAt) {
        const description = await actions.next();
        const action = { step: actions.count, elapsedMs: Date.now() - runningAt, description };
        actionLog.push(action);
        deps.onAction?.(action);
        actionAt = Date.now() + options.pause;
      }
      if (options.scroll && Date.now() >= scrollAt) {
        await page.mouse.wheel(0, options.scroll);
        scrollAt = Date.now() + options.interval;
      }
      await new Promise((r2) => setTimeout(r2, Math.min(500, Math.max(0, until - Date.now()))));
    }
    const injectionError = await page.evaluate(() => window.__daSiteProbe.injectionError);
    if (injectionError) errors.push(injectionError);
    if (options.report) {
      deps.onStatus?.("Flushing the installed SDK and waiting for collection responses\u2026");
      const canReport = await page.evaluate(() => {
        const sdk = window.doubleagent;
        if (typeof sdk?.flush !== "function") return false;
        sdk.flush();
        return true;
      });
      if (!canReport) errors.push("No installed Double Agent SDK was available to report this visit.");
      const drainStarted = Date.now();
      do {
        await new Promise((r2) => setTimeout(r2, 100));
      } while (Date.now() - drainStarted < 1200 || pending.size > 0 && Date.now() - drainStarted < 6500);
    }
    const observed = fixture ? snapshots.some((row) => row.injected?.id === fixture.id && row.observed) : null;
    return {
      schemaVersion: "1",
      runId: randomUUID(),
      target: cleanTarget(options.url),
      options: (({ url: _url, ...rest }) => rest)(options),
      startedAt,
      finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      browser: browser.version(),
      status: signFailed || deps.signRequest && !signed || injectionError || fixture && !observed || options.report && !accepted ? "fail" : fixture ? "pass" : "observed",
      expectedSignal: fixture?.reason ?? null,
      injectedFixtureObserved: observed,
      actionsCompleted: actions?.count ?? 0,
      actions: actionLog,
      declared_identity: parseAgentUserAgent(userAgent ?? ""),
      ...deps.signRequest ? { signing: { signed, failed: signFailed } } : {},
      reporting: {
        mode: options.report ? "site" : "isolated",
        accepted,
        blocked,
        outcome: !options.report ? "blocked" : accepted ? "accepted" : "not-confirmed",
        receipts: [...receipts],
        pending: pending.size
      },
      snapshots,
      errors,
      limits: [
        "Behavior scenarios are scripted patterns using trusted browser input on temporary test controls, not real LLM agents or tasks on the website.",
        "Behavior-only is a diagnostic score excluding identity and environment signals. The full verdict remains authoritative for this test.",
        "Fixture pass means the requested signal was observed, not that a real AI agent or provider was verified.",
        "Playwright remains detectable. Observe is not proof of a human visit; human controls require a person in a normal browser.",
        "Local detector output and the installed SDK/server verdict can differ; both are reported when available.",
        "Isolated blocks standard Double Agent telemetry paths; the target website can still receive page requests and its other analytics.",
        ...options.report ? ["Reporting uses the installed SDK and its consent/settings. Accepted collection is not proof of dashboard indexing; synthetic visits are not automatically labelled as tests."] : []
      ]
    };
  } finally {
    deps.signal?.removeEventListener("abort", cancel);
    await context?.close().catch(() => {
    });
    await browser?.close().catch(() => {
    });
  }
}

// ../../node_modules/@slicekit/erc8128/node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i2 = 0; i2 < len; i2++) {
    const { h: h2, l } = fromBig(lst[i2], le);
    [Ah[i2], Al[i2]] = [h2, l];
  }
  return [Ah, Al];
}
var fromNumH = (n) => n / 2 ** 32 | 0;
var fromNumL = (n) => n >>> 0;
function setU64FromNum(view, byteOffset, n, isLE2) {
  const h2 = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE2 ? l : h2, isLE2);
  view.setUint32(byteOffset + 4, isLE2 ? h2 : l, isLE2);
}
var shrSH = (h2, _l, s2) => h2 >>> s2;
var shrSL = (h2, l, s2) => h2 << 32 - s2 | l >>> s2;
var rotrSH = (h2, l, s2) => h2 >>> s2 | l << 32 - s2;
var rotrSL = (h2, l, s2) => h2 << 32 - s2 | l >>> s2;
var rotrBH = (h2, l, s2) => h2 << 64 - s2 | l >>> s2 - 32;
var rotrBL = (h2, l, s2) => h2 >>> s2 - 32 | l << 64 - s2;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

// ../../node_modules/@slicekit/erc8128/node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle = (title) => title ? `"${title}" ` : "";
function anumber(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes(value, length, title = "") {
  if (isBytes(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber(length, "length");
  const bytes = isBytes(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
var aobject = (value, label) => {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
};
var aopts = (value, label) => {
  aobject(value, label);
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null)
    throw new TypeError(`"${label}" expected plain object`);
  if (Object.hasOwn(value, "__proto__"))
    throw new TypeError(`"${label}.__proto__" is not allowed`);
};
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function clean(...arrays) {
  for (let i2 = 0; i2 < arrays.length; i2++) {
    arrays[i2].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function checkOpts(defaults, opts, title = "opts") {
  aopts(defaults, "defaults");
  if (opts !== void 0)
    aopts(opts, title);
  const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// ../../node_modules/@slicekit/erc8128/node_modules/@noble/hashes/_md.js
function Chi(a, b, c2) {
  return a & b ^ ~a & c2;
}
function Maj(a, b, c2) {
  return a & b ^ a & c2 ^ b & c2;
}
var HashMD = class {
  blockLen;
  outputLen;
  canXOF = false;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE2) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    let processed = false;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        processed = true;
        continue;
      }
      buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
        processed = true;
      }
    }
    this.length += data.length;
    if (processed)
      this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    buffer.fill(0, pos);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      buffer.fill(0);
    }
    setU64FromNum(view, blockLen - 8, this.length * 8, isLE2);
    this.process(view, 0);
    this.roundClean();
    const oview = out === buffer ? view : createView(out);
    const len = this.outputLen;
    const outLen = len / 4;
    const state = this.get();
    if (len % 4 || outLen > state.length)
      throw new Error("invalid outputLen");
    for (let i2 = 0; i2 < outLen; i2++)
      oview.setUint32(4 * i2, state[i2], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneIntoMeta(to) {
    const { buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (pos)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);

// ../../node_modules/@slicekit/erc8128/node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and makes sha256 3x slower (measured).
  A = 0;
  B = 0;
  C = 0;
  D = 0;
  E = 0;
  F = 0;
  G = 0;
  H = 0;
  constructor(outputLen, IV) {
    super(64, outputLen, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C: C2, D, E: E2, F, G, H } = this;
    return [A, B, C2, D, E2, F, G, H];
  }
  // prettier-ignore
  set(A, B, C2, D, E2, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C2 | 0;
    this.D = D | 0;
    this.E = E2 | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4)
      SHA256_W[i2] = view.getUint32(offset, false);
    for (let i2 = 16; i2 < 64; i2++) {
      const W15 = SHA256_W[i2 - 15];
      const W2 = SHA256_W[i2 - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s12 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i2] = s12 + SHA256_W[i2 - 7] + s0 + SHA256_W[i2 - 16] | 0;
    }
    let { A, B, C: C2, D, E: E2, F, G, H } = this;
    for (let i2 = 0; i2 < 64; i2++) {
      const sigma1 = rotr(E2, 6) ^ rotr(E2, 11) ^ rotr(E2, 25);
      const T12 = H + sigma1 + Chi(E2, F, G) + SHA256_K[i2] + SHA256_W[i2] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C2) | 0;
      H = G;
      G = F;
      F = E2;
      E2 = D + T12 | 0;
      D = C2;
      C2 = B;
      B = A;
      A = T12 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C2 = C2 + this.C | 0;
    D = D + this.D | 0;
    E2 = E2 + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C2, D, E2, F, G, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.destroyed = true;
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  constructor() {
    super(32, SHA256_IV);
  }
};
var K512 = /* @__PURE__ */ (() => split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA2_64B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // h -- high 32 bits, l -- low 32 bits
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and slows hashing down (measured on sha256).
  Ah = 0;
  Al = 0;
  Bh = 0;
  Bl = 0;
  Ch = 0;
  Cl = 0;
  Dh = 0;
  Dl = 0;
  Eh = 0;
  El = 0;
  Fh = 0;
  Fl = 0;
  Gh = 0;
  Gl = 0;
  Hh = 0;
  Hl = 0;
  constructor(outputLen, IV) {
    super(128, outputLen, 16, false);
    this.Ah = IV[0] | 0;
    this.Al = IV[1] | 0;
    this.Bh = IV[2] | 0;
    this.Bl = IV[3] | 0;
    this.Ch = IV[4] | 0;
    this.Cl = IV[5] | 0;
    this.Dh = IV[6] | 0;
    this.Dl = IV[7] | 0;
    this.Eh = IV[8] | 0;
    this.El = IV[9] | 0;
    this.Fh = IV[10] | 0;
    this.Fl = IV[11] | 0;
    this.Gh = IV[12] | 0;
    this.Gl = IV[13] | 0;
    this.Hh = IV[14] | 0;
    this.Hl = IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view, offset) {
    for (let i2 = 0; i2 < 16; i2++, offset += 4) {
      SHA512_W_H[i2] = view.getUint32(offset);
      SHA512_W_L[i2] = view.getUint32(offset += 4);
    }
    for (let i2 = 16; i2 < 80; i2++) {
      const W15h = SHA512_W_H[i2 - 15] | 0;
      const W15l = SHA512_W_L[i2 - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i2 - 2] | 0;
      const W2l = SHA512_W_L[i2 - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i2 - 7], SHA512_W_L[i2 - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i2 - 7], SHA512_W_H[i2 - 16]);
      SHA512_W_H[i2] = SUMh | 0;
      SHA512_W_L[i2] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i2 = 0; i2 < 80; i2++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i2], SHA512_W_L[i2]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i2], SHA512_W_H[i2]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var _SHA512 = class extends SHA2_64B {
  constructor() {
    super(64, SHA512_IV);
  }
};
var sha256 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);
var sha512 = /* @__PURE__ */ createHasher(
  () => new _SHA512(),
  /* @__PURE__ */ oidNist(3)
);

// ../../node_modules/viem/_esm/index.js
init_exports();

// ../../node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
init_getAddress();
init_keccak256();
function publicKeyToAddress(publicKey2) {
  const address2 = keccak256(`0x${publicKey2.substring(4)}`).substring(26);
  return checksumAddress(`0x${address2}`);
}

// ../../node_modules/viem/_esm/utils/authorization/hashAuthorization.js
init_concat();
init_toBytes();
init_toHex();

// ../../node_modules/viem/_esm/utils/encoding/toRlp.js
init_base();
init_cursor2();
init_toBytes();
init_toHex();
function toRlp(bytes, to = "hex") {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === "hex")
    return bytesToHex(cursor.bytes);
  return cursor.bytes;
}
function getEncodable(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList(bytes.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode } of list) {
        encode(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError2("Length is too large.");
}

// ../../node_modules/viem/_esm/utils/authorization/hashAuthorization.js
init_keccak256();
function hashAuthorization(parameters) {
  const { chainId, nonce, to } = parameters;
  const address2 = parameters.contractAddress ?? parameters.address;
  const hash2 = keccak256(concatHex([
    "0x05",
    toRlp([
      chainId ? numberToHex(chainId) : "0x",
      address2,
      nonce ? numberToHex(nonce) : "0x"
    ])
  ]));
  if (to === "bytes")
    return hexToBytes(hash2);
  return hash2;
}

// ../../node_modules/viem/_esm/utils/blob/blobsToCommitments.js
init_toBytes();
init_toHex();
function blobsToCommitments(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === "bytes" ? commitments : commitments.map((x) => bytesToHex(x));
}

// ../../node_modules/viem/_esm/utils/blob/blobsToProofs.js
init_toBytes();
init_toHex();
function blobsToProofs(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
  const proofs = [];
  for (let i2 = 0; i2 < blobs.length; i2++) {
    const blob = blobs[i2];
    const commitment = commitments[i2];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === "bytes" ? proofs : proofs.map((x) => bytesToHex(x));
}

// ../../node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
init_toHex();

// ../../node_modules/@noble/hashes/esm/sha256.js
init_sha2();
var sha2563 = sha2562;

// ../../node_modules/viem/_esm/utils/hash/sha256.js
init_isHex();
init_toBytes();
init_toHex();
function sha2564(value, to_) {
  const to = to_ || "hex";
  const bytes = sha2563(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}

// ../../node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
function commitmentToVersionedHash(parameters) {
  const { commitment, version: version3 = 1 } = parameters;
  const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
  const versionedHash = sha2564(commitment, "bytes");
  versionedHash.set([version3], 0);
  return to === "bytes" ? versionedHash : bytesToHex(versionedHash);
}

// ../../node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
function commitmentsToVersionedHashes(parameters) {
  const { commitments, version: version3 } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version: version3
    }));
  }
  return hashes;
}

// ../../node_modules/viem/_esm/constants/blob.js
var blobsPerTransaction = 6;
var bytesPerFieldElement = 32;
var fieldElementsPerBlob = 4096;
var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
1 - // zero byte (0x00) appended to each field element.
1 * fieldElementsPerBlob * blobsPerTransaction;

// ../../node_modules/viem/_esm/constants/kzg.js
var versionedHashVersionKzg = 1;

// ../../node_modules/viem/_esm/errors/blob.js
init_base();
var BlobSizeTooLargeError = class extends BaseError2 {
  constructor({ maxSize, size: size2 }) {
    super("Blob size is too large.", {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size2} bytes`],
      name: "BlobSizeTooLargeError"
    });
  }
};
var EmptyBlobError = class extends BaseError2 {
  constructor() {
    super("Blob data must not be empty.", { name: "EmptyBlobError" });
  }
};
var InvalidVersionedHashSizeError = class extends BaseError2 {
  constructor({ hash: hash2, size: size2 }) {
    super(`Versioned hash "${hash2}" size is invalid.`, {
      metaMessages: ["Expected: 32", `Received: ${size2}`],
      name: "InvalidVersionedHashSizeError"
    });
  }
};
var InvalidVersionedHashVersionError = class extends BaseError2 {
  constructor({ hash: hash2, version: version3 }) {
    super(`Versioned hash "${hash2}" version is invalid.`, {
      metaMessages: [
        `Expected: ${versionedHashVersionKzg}`,
        `Received: ${version3}`
      ],
      name: "InvalidVersionedHashVersionError"
    });
  }
};

// ../../node_modules/viem/_esm/utils/blob/toBlobs.js
init_cursor2();
init_size();
init_toBytes();
init_toHex();
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
  const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
  const size_ = size(data);
  if (!size_)
    throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size2 = 0;
    while (size2 < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      blob.pushByte(0);
      blob.pushBytes(bytes);
      if (bytes.length < 31) {
        blob.pushByte(128);
        active = false;
        break;
      }
      size2++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex(x.bytes));
}

// ../../node_modules/viem/_esm/utils/blob/toBlobSidecars.js
function toBlobSidecars(parameters) {
  const { data, kzg, to } = parameters;
  const blobs = parameters.blobs ?? toBlobs({ data, to });
  const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
  const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
  const sidecars = [];
  for (let i2 = 0; i2 < blobs.length; i2++)
    sidecars.push({
      blob: blobs[i2],
      commitment: commitments[i2],
      proof: proofs[i2]
    });
  return sidecars;
}

// ../../node_modules/viem/_esm/utils/transaction/getTransactionType.js
init_transaction();
function getTransactionType(transaction) {
  if (transaction.type)
    return transaction.type;
  if (typeof transaction.authorizationList !== "undefined")
    return "eip7702";
  if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
    return "eip4844";
  if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
    return "eip1559";
  }
  if (typeof transaction.gasPrice !== "undefined") {
    if (typeof transaction.accessList !== "undefined")
      return "eip2930";
    return "legacy";
  }
  throw new InvalidSerializableTransactionError({ transaction });
}

// ../../node_modules/viem/_esm/utils/authorization/serializeAuthorizationList.js
init_toHex();

// ../../node_modules/viem/_esm/utils/transaction/serializeTransaction.js
init_transaction();
init_concat();
init_trim();
init_toHex();

// ../../node_modules/viem/_esm/utils/transaction/assertTransaction.js
init_number();
init_address();
init_base();
init_chain();
init_node();
init_isAddress();
init_size();
init_slice();
init_fromHex();
function assertTransactionEIP7702(transaction) {
  const { authorizationList } = transaction;
  if (authorizationList) {
    for (const authorization of authorizationList) {
      const { chainId } = authorization;
      const address2 = authorization.address;
      if (!isAddress(address2))
        throw new InvalidAddressError({ address: address2 });
      if (chainId < 0)
        throw new InvalidChainIdError({ chainId });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP4844(transaction) {
  const { blobVersionedHashes } = transaction;
  if (blobVersionedHashes) {
    if (blobVersionedHashes.length === 0)
      throw new EmptyBlobError();
    for (const hash2 of blobVersionedHashes) {
      const size_ = size(hash2);
      const version3 = hexToNumber(slice(hash2, 0, 1));
      if (size_ !== 32)
        throw new InvalidVersionedHashSizeError({ hash: hash2, size: size_ });
      if (version3 !== versionedHashVersionKzg)
        throw new InvalidVersionedHashVersionError({
          hash: hash2,
          version: version3
        });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP1559(transaction) {
  const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
function assertTransactionEIP2930(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError2("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
function assertTransactionLegacy(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (typeof chainId !== "undefined" && chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError2("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}

// ../../node_modules/viem/_esm/utils/transaction/serializeAccessList.js
init_address();
init_transaction();
init_isAddress();
function serializeAccessList(accessList) {
  if (!accessList || accessList.length === 0)
    return [];
  const serializedAccessList = [];
  for (let i2 = 0; i2 < accessList.length; i2++) {
    const { address: address2, storageKeys } = accessList[i2];
    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
      }
    }
    if (!isAddress(address2, { strict: false })) {
      throw new InvalidAddressError({ address: address2 });
    }
    serializedAccessList.push([address2, storageKeys]);
  }
  return serializedAccessList;
}

// ../../node_modules/viem/_esm/utils/transaction/serializeTransaction.js
function serializeTransaction(transaction, signature) {
  const type = getTransactionType(transaction);
  if (type === "eip1559")
    return serializeTransactionEIP1559(transaction, signature);
  if (type === "eip2930")
    return serializeTransactionEIP2930(transaction, signature);
  if (type === "eip4844")
    return serializeTransactionEIP4844(transaction, signature);
  if (type === "eip7702")
    return serializeTransactionEIP7702(transaction, signature);
  return serializeTransactionLegacy(transaction, signature);
}
function serializeTransactionEIP7702(transaction, signature) {
  const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP7702(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
  return concatHex([
    "0x04",
    toRlp([
      numberToHex(chainId),
      nonce ? numberToHex(nonce) : "0x",
      maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
      maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x",
      serializedAccessList,
      serializedAuthorizationList,
      ...toYParitySignatureArray(transaction, signature)
    ])
  ]);
}
function serializeTransactionEIP4844(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP4844(transaction);
  let blobVersionedHashes = transaction.blobVersionedHashes;
  let sidecars = transaction.sidecars;
  if (transaction.blobs && (typeof blobVersionedHashes === "undefined" || typeof sidecars === "undefined")) {
    const blobs2 = typeof transaction.blobs[0] === "string" ? transaction.blobs : transaction.blobs.map((x) => bytesToHex(x));
    const kzg = transaction.kzg;
    const commitments2 = blobsToCommitments({
      blobs: blobs2,
      kzg
    });
    if (typeof blobVersionedHashes === "undefined")
      blobVersionedHashes = commitmentsToVersionedHashes({
        commitments: commitments2
      });
    if (typeof sidecars === "undefined") {
      const proofs2 = blobsToProofs({ blobs: blobs2, commitments: commitments2, kzg });
      sidecars = toBlobSidecars({ blobs: blobs2, commitments: commitments2, proofs: proofs2 });
    }
  }
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    maxFeePerBlobGas ? numberToHex(maxFeePerBlobGas) : "0x",
    blobVersionedHashes ?? [],
    ...toYParitySignatureArray(transaction, signature)
  ];
  const blobs = [];
  const commitments = [];
  const proofs = [];
  if (sidecars)
    for (let i2 = 0; i2 < sidecars.length; i2++) {
      const { blob, commitment, proof } = sidecars[i2];
      blobs.push(blob);
      commitments.push(commitment);
      proofs.push(proof);
    }
  return concatHex([
    "0x03",
    sidecars ? (
      // If sidecars are enabled, envelope turns into a "wrapper":
      toRlp([serializedTransaction, blobs, commitments, proofs])
    ) : (
      // If sidecars are disabled, standard envelope is used:
      toRlp(serializedTransaction)
    )
  ]);
}
function serializeTransactionEIP1559(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP1559(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x02",
    toRlp(serializedTransaction)
  ]);
}
function serializeTransactionEIP2930(transaction, signature) {
  const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
  assertTransactionEIP2930(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x01",
    toRlp(serializedTransaction)
  ]);
}
function serializeTransactionLegacy(transaction, signature) {
  const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
  assertTransactionLegacy(transaction);
  let serializedTransaction = [
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x"
  ];
  if (signature) {
    const v = (() => {
      if (signature.v >= 35n) {
        const inferredChainId = (signature.v - 35n) / 2n;
        if (inferredChainId > 0)
          return signature.v;
        return 27n + (signature.v === 35n ? 0n : 1n);
      }
      if (chainId > 0)
        return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
      const v2 = 27n + (signature.v === 27n ? 0n : 1n);
      if (signature.v !== v2)
        throw new InvalidLegacyVError({ v: signature.v });
      return v2;
    })();
    const r2 = trim(signature.r);
    const s2 = trim(signature.s);
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(v),
      r2 === "0x00" ? "0x" : r2,
      s2 === "0x00" ? "0x" : s2
    ];
  } else if (chainId > 0) {
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(chainId),
      "0x",
      "0x"
    ];
  }
  return toRlp(serializedTransaction);
}
function toYParitySignatureArray(transaction, signature_) {
  const signature = signature_ ?? transaction;
  const { v, yParity } = signature;
  if (typeof signature.r === "undefined")
    return [];
  if (typeof signature.s === "undefined")
    return [];
  if (typeof v === "undefined" && typeof yParity === "undefined")
    return [];
  const r2 = trim(signature.r);
  const s2 = trim(signature.s);
  const yParity_ = (() => {
    if (typeof yParity === "number")
      return yParity ? numberToHex(1) : "0x";
    if (v === 0n)
      return "0x";
    if (v === 1n)
      return numberToHex(1);
    return v === 27n ? "0x" : numberToHex(1);
  })();
  return [yParity_, r2 === "0x00" ? "0x" : r2, s2 === "0x00" ? "0x" : s2];
}

// ../../node_modules/viem/_esm/utils/authorization/serializeAuthorizationList.js
function serializeAuthorizationList(authorizationList) {
  if (!authorizationList || authorizationList.length === 0)
    return [];
  const serializedAuthorizationList = [];
  for (const authorization of authorizationList) {
    const { chainId, nonce, ...signature } = authorization;
    const contractAddress = authorization.address;
    serializedAuthorizationList.push([
      chainId ? toHex(chainId) : "0x",
      contractAddress,
      nonce ? toHex(nonce) : "0x",
      ...toYParitySignatureArray({}, signature)
    ]);
  }
  return serializedAuthorizationList;
}

// ../../node_modules/viem/_esm/utils/signature/hashMessage.js
init_keccak256();

// ../../node_modules/viem/_esm/constants/strings.js
var presignMessagePrefix = "Ethereum Signed Message:\n";

// ../../node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
init_concat();
init_size();
init_toHex();
function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === "string")
      return stringToHex(message_);
    if (typeof message_.raw === "string")
      return message_.raw;
    return bytesToHex(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
  return concat([prefix, message]);
}

// ../../node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}

// ../../node_modules/viem/_esm/utils/signature/hashTypedData.js
init_encodeAbiParameters();
init_concat();
init_toHex();
init_keccak256();

// ../../node_modules/viem/_esm/utils/typedData.js
init_abi();
init_address();

// ../../node_modules/viem/_esm/errors/typedData.js
init_stringify();
init_base();
var InvalidDomainError = class extends BaseError2 {
  constructor({ domain }) {
    super(`Invalid domain "${stringify(domain)}".`, {
      metaMessages: ["Must be a valid EIP-712 domain."]
    });
  }
};
var InvalidPrimaryTypeError = class extends BaseError2 {
  constructor({ primaryType, types }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
      docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
      metaMessages: ["Check that the primary type is a key in `types`."]
    });
  }
};
var InvalidStructTypeError = class extends BaseError2 {
  constructor({ type }) {
    super(`Struct type "${type}" is invalid.`, {
      metaMessages: ["Struct type must not be a Solidity type."],
      name: "InvalidStructTypeError"
    });
  }
};
var InvalidTypedDataTypeError = class extends BaseError2 {
  constructor({ type }) {
    const canonicalType = type.replace(/^(u?int)/, "$&256");
    super(`Type "${type}" is not a valid EIP-712 type.`, {
      metaMessages: [`Use "${canonicalType}" instead.`],
      name: "InvalidTypedDataTypeError"
    });
  }
};

// ../../node_modules/viem/_esm/utils/typedData.js
init_isAddress();
init_size();
init_toHex();
init_regex2();
function validateTypedData(parameters) {
  const { domain, message, primaryType, types } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const { name, type } = param;
      const value = data[name];
      const baseType = type.replace(/(\[[0-9]*\])+$/, "");
      if (baseType === "int" || baseType === "uint")
        throw new InvalidTypedDataTypeError({ type });
      const integerMatch = type.match(integerRegex2);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base2, size_] = integerMatch;
        numberToHex(value, {
          signed: base2 === "int",
          size: Number.parseInt(size_, 10) / 8
        });
      }
      if (type === "address" && typeof value === "string" && !isAddress(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type.match(bytesRegex2);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_, 10))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_, 10),
            givenSize: size(value)
          });
      }
      const struct2 = types[type];
      if (struct2) {
        validateReference(type);
        validateData(struct2, value);
      }
    }
  };
  if (types.EIP712Domain && domain) {
    if (typeof domain !== "object")
      throw new InvalidDomainError({ domain });
    validateData(types.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types[primaryType])
      validateData(types[primaryType], message);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types });
  }
}
function getTypesForEIP712Domain({ domain }) {
  return [
    typeof domain?.name === "string" && { name: "name", type: "string" },
    domain?.version && { name: "version", type: "string" },
    (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
      name: "chainId",
      type: "uint256"
    },
    domain?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    domain?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
function validateReference(type) {
  if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
    throw new InvalidStructTypeError({ type });
}

// ../../node_modules/viem/_esm/utils/signature/hashTypedData.js
function hashTypedData(parameters) {
  const { domain = {}, message, primaryType } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x1901"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct({
      data: message,
      primaryType,
      types
    }));
  return keccak256(concat(parts));
}
function hashDomain({ domain, types }) {
  return hashStruct({
    data: domain,
    primaryType: "EIP712Domain",
    types
  });
}
function hashStruct({ data, primaryType, types }) {
  const encoded = encodeData({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
function encodeData({ data, primaryType, types }) {
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({ primaryType, types }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
}
function encodeType({ primaryType, types }) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types[primaryType] === void 0) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results);
  }
  return results;
}
function encodeField({ types, name, type, value }) {
  if (types[type] !== void 0) {
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type, types }))
    ];
  }
  if (type === "bytes")
    return [{ type: "bytes32" }, keccak256(value)];
  if (type === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type }, value];
}

// ../../node_modules/viem/_esm/utils/signature/serializeSignature.js
init_secp256k1();
init_fromHex();
init_toBytes();
function serializeSignature({ r: r2, s: s2, to = "hex", v, yParity }) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1)
      return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n))
      return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  const signature = `0x${new secp256k1.Signature(hexToBigInt(r2), hexToBigInt(s2)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
  if (to === "hex")
    return signature;
  return hexToBytes(signature);
}

// ../../node_modules/viem/_esm/index.js
init_decodeFunctionResult();
init_encodeFunctionData();

// ../../node_modules/@slicekit/erc8128/dist/esm/index.js
var R = class extends Error {
  code;
  constructor(_, f) {
    super(f);
    this.code = _;
    this.name = "Erc8128Error";
  }
};
var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var Q1 = (() => {
  let _ = new Uint8Array(256);
  _.fill(255);
  for (let f = 0; f < g.length; f++) _[g.charCodeAt(f)] = f;
  return _[45] = 62, _[95] = 63, _;
})();
function i_(_, f) {
  if (_ instanceof Request) return f ? new Request(_, f) : _;
  return new Request(_, f);
}
function s_(_) {
  return typeof _ === "object" && _ !== null && typeof _.signMessage === "function";
}
function O(_) {
  try {
    return new URL(_);
  } catch {
    throw new R("UNSUPPORTED_REQUEST", `Request.url must be absolute (got: ${_}).`);
  }
}
function i() {
  return Math.floor(Date.now() / 1e3);
}
function q_(_) {
  return new TextEncoder().encode(_);
}
function p8(_) {
  let f = globalThis.crypto;
  if (!f?.getRandomValues) throw new R("CRYPTO_UNAVAILABLE", "crypto.getRandomValues required.");
  let w = new Uint8Array(_);
  return f.getRandomValues(w), w;
}
async function s(_) {
  try {
    let w = await _.clone().arrayBuffer();
    return new Uint8Array(w);
  } catch {
    throw new R("BODY_READ_FAILED", "Failed to read request body (stream locked/disturbed).");
  }
}
async function r_(_) {
  return sha256(_);
}
function m(_) {
  let f = "", w = 0;
  for (; w + 2 < _.length; w += 3) {
    let U = _[w] << 16 | _[w + 1] << 8 | _[w + 2];
    f += g[U >> 18 & 63] + g[U >> 12 & 63] + g[U >> 6 & 63] + g[U & 63];
  }
  if (w === _.length) return f;
  let N = _[w] << 16;
  if (w + 1 < _.length) {
    let U = N | _[w + 1] << 8;
    f += g[U >> 18 & 63] + g[U >> 12 & 63] + g[U >> 6 & 63] + "=";
  } else f += `${g[N >> 18 & 63] + g[N >> 12 & 63]}==`;
  return f;
}
function H_(_) {
  try {
    let f = _.trim().replace(/=+$/g, "");
    if (f.length === 0) return new Uint8Array(0);
    if (f.length % 4 === 1) return null;
    let w = new Uint8Array(Math.floor(f.length * 3 / 4)), N = 0, U = 0, $ = 0;
    for (let J = 0; J < f.length; J++) {
      let I = Q1[f.charCodeAt(J)];
      if (I === 255) return null;
      if (N = N << 6 | I, U += 6, U >= 8) U -= 8, w[$++] = N >> U & 255;
    }
    return $ === w.length ? w : w.slice(0, $);
  } catch {
    return null;
  }
}
function o8(_) {
  return m(_).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function P(_) {
  if (!/^0x(?:[0-9a-fA-F]{2})*$/.test(_)) throw new R("UNSUPPORTED_REQUEST", "Invalid hex bytes.");
  let f = _.slice(2), w = new Uint8Array(f.length / 2);
  for (let N = 0; N < w.length; N++) w[N] = parseInt(f.slice(N * 2, N * 2 + 2), 16);
  return w;
}
var t8 = 16384;
var i8 = 64;
var W1 = 32;
var X1 = 16;
var s8 = 4096;
var a_ = 65536;
var r8 = new TextEncoder();
function d(_) {
  if (_.length === 0 || r8.encode(_).length > t8) throw C("Structured Field Dictionary has an invalid size.");
  let f = new w8(_), w = {}, N = 0;
  f.skipOptionalWhitespace();
  while (!f.done()) {
    if (N += 1, N > i8) throw new R("LIMIT_EXCEEDED", "Structured Field Dictionary has too many members.");
    let U = f.parseKey(), $;
    if (f.peek() === "=") f.advance(), $ = f.parseMember();
    else $ = { value: true, params: f.parseParameters() };
    if (w[U] = $, f.skipOptionalWhitespace(), f.done()) break;
    if (f.expect(","), f.skipOptionalWhitespace(), f.done()) throw C("Trailing Dictionary comma.");
  }
  return w;
}
function y_(_) {
  let f = Object.entries(_);
  if (f.length === 0 || f.length > i8) throw new R("BAD_HEADER_VALUE", "Structured Field Dictionary has an invalid member count.");
  return f.map(([w, N]) => {
    if (ff(w), H1(N) && N.value === true) return `${w}${f8(N.params)}`;
    return `${w}=${a8(N)}`;
  }).join(", ");
}
function e_(_) {
  return y_(d(_));
}
function c(_) {
  return a8(_);
}
function a8(_) {
  if (_f(_)) {
    if (_.items.length > W1) throw new R("BAD_HEADER_VALUE", "Structured Field Inner List has an invalid item count.");
    return `(${_.items.map(n8).join(" ")})${f8(_.params)}`;
  }
  return n8(_);
}
function n8(_) {
  return `${e8(_.value)}${f8(_.params)}`;
}
function e8(_) {
  if (typeof _ === "string") {
    if (_.length > s8) throw new R("BAD_HEADER_VALUE", "String is too large.");
    if (!/^[\x20-\x7E]*$/.test(_)) throw new R("BAD_HEADER_VALUE", "Structured Field strings must contain visible ASCII or spaces.");
    return `"${_.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  if (typeof _ === "boolean") return _ ? "?1" : "?0";
  if (typeof _ === "number") {
    if (!Number.isFinite(_)) throw new R("BAD_HEADER_VALUE", "Invalid Structured Field number.");
    if (Number.isInteger(_)) {
      if (Math.abs(_) > 999999999999999) throw new R("BAD_HEADER_VALUE", "Integer is out of range.");
      return String(_);
    }
    if (Math.abs(_) >= 1e12) throw new R("BAD_HEADER_VALUE", "Decimal is out of range.");
    let f = Math.round(_ * 1e3) / 1e3;
    if (f !== _) throw new R("BAD_HEADER_VALUE", "Decimal has more than three fractional digits.");
    return f.toFixed(3).replace(/0+$/, "").replace(/\.$/, ".0");
  }
  if (_.type === "decimal") {
    let f = Math.round(_.value * 1e3) / 1e3;
    if (!Number.isFinite(_.value) || Math.abs(_.value) >= 1e12 || f !== _.value) throw new R("BAD_HEADER_VALUE", "Invalid Structured Field Decimal.");
    return f.toFixed(3).replace(/0+$/, "").replace(/\.$/, ".0");
  }
  if (_.type === "token") return wf(_.value), _.value;
  if (_.value.length > a_) throw new R("BAD_HEADER_VALUE", "Byte Sequence is too large.");
  return `:${m(_.value)}:`;
}
function f8(_) {
  if (!_) return "";
  let f = Object.entries(_);
  if (f.length > X1) throw new R("BAD_HEADER_VALUE", "Too many parameters.");
  return f.map(([w, N]) => {
    return ff(w), N === true ? `;${w}` : `;${w}=${e8(N)}`;
  }).join("");
}
function _f(_) {
  return "items" in _;
}
function H1(_) {
  return "value" in _;
}
function ff(_) {
  if (!/^[a-z*][a-z0-9_.*-]*$/.test(_)) throw new R("BAD_HEADER_VALUE", `Invalid key: ${_}.`);
}
function wf(_) {
  if (!/^[A-Za-z*][A-Za-z0-9_.*:/!#$%&'+\-^`|~]*$/.test(_)) throw new R("BAD_HEADER_VALUE", `Invalid token: ${_}.`);
}
function C(_) {
  return new R("PARSE_ERROR", _);
}
var w8 = class {
  source;
  index = 0;
  constructor(_) {
    this.source = _;
  }
  done() {
    return this.index === this.source.length;
  }
  peek() {
    return this.source[this.index];
  }
  advance() {
    this.index += 1;
  }
  expect(_) {
    if (this.peek() !== _) throw C(`Expected '${_}'.`);
    this.advance();
  }
  skipOptionalWhitespace() {
    while (this.peek() === " " || this.peek() === "	") this.advance();
  }
  parseKey() {
    let _ = this.index, f = this.peek();
    if (f === void 0 || !/[a-z*]/.test(f)) throw C("Invalid Structured Field key.");
    this.advance();
    while (this.peek() !== void 0 && /[a-z0-9_.*-]/.test(this.peek() ?? "")) this.advance();
    return this.source.slice(_, this.index);
  }
  parseMember() {
    if (this.peek() === "(") return this.parseInnerList();
    return this.parseItem();
  }
  parseItem() {
    return { value: this.parseBareItem(), params: this.parseParameters() };
  }
  parseInnerList() {
    this.expect("(");
    let _ = [];
    while (true) {
      while (this.peek() === " ") this.advance();
      if (this.peek() === ")") {
        this.advance();
        break;
      }
      if (_.push(this.parseItem()), this.peek() !== " " && this.peek() !== ")") throw C("Inner List items must be separated by spaces.");
    }
    return { items: _, params: this.parseParameters() };
  }
  parseParameters() {
    let _ = {};
    while (this.peek() === ";") {
      this.advance();
      let f = this.parseKey();
      if (this.peek() === "=") this.advance(), _[f] = this.parseBareItem();
      else _[f] = true;
    }
    return _;
  }
  parseBareItem() {
    let _ = this.peek();
    if (_ === '"') return this.parseString();
    if (_ === ":") return this.parseBinary();
    if (_ === "?") return this.parseBoolean();
    if (_ === "-" || _ !== void 0 && /[0-9]/.test(_)) return this.parseNumber();
    return this.parseToken();
  }
  parseString() {
    this.expect('"');
    let _ = "";
    while (!this.done()) {
      let f = this.peek();
      if (this.advance(), f === '"') return _;
      if (f === "\\") {
        let w = this.peek();
        if (w !== '"' && w !== "\\") throw C("Invalid Structured Field string escape.");
        _ += w, this.advance();
      } else {
        if (f === void 0 || !/^[\x20-\x7E]$/.test(f)) throw C("Invalid Structured Field string character.");
        _ += f;
      }
      if (_.length > s8) throw C("String is too large.");
    }
    throw C("Unterminated Structured Field string.");
  }
  parseBinary() {
    this.expect(":");
    let _ = this.index;
    while (this.peek() !== void 0 && this.peek() !== ":") this.advance();
    if (this.done()) throw C("Unterminated Byte Sequence.");
    let f = this.source.slice(_, this.index);
    if (this.advance(), !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(f)) throw C("Invalid base64 Byte Sequence.");
    let w = H_(f);
    if (w === null || m(w) !== f) throw C("Non-canonical Byte Sequence.");
    if (w.length > a_) throw C("Byte Sequence is too large.");
    return { type: "binary", value: w };
  }
  parseBoolean() {
    this.expect("?");
    let _ = this.peek();
    if (_ !== "0" && _ !== "1") throw C("Invalid Boolean.");
    return this.advance(), _ === "1";
  }
  parseNumber() {
    let _ = this.index;
    if (this.peek() === "-") this.advance();
    let f = this.index;
    while (this.peek() !== void 0 && /[0-9]/.test(this.peek() ?? "")) this.advance();
    let w = this.index - f;
    if (w === 0 || w > 15) throw C("Invalid Integer.");
    let N = this.peek() === ".";
    if (N) {
      if (w > 12) throw C("Invalid Decimal.");
      this.advance();
      let $ = this.index;
      while (this.peek() !== void 0 && /[0-9]/.test(this.peek() ?? "")) this.advance();
      let J = this.index - $;
      if (J === 0 || J > 3) throw C("Invalid Decimal.");
    }
    let U = Number(this.source.slice(_, this.index));
    if (!Number.isFinite(U)) throw C("Invalid number.");
    return N ? { type: "decimal", value: U } : U;
  }
  parseToken() {
    let _ = this.index, f = this.peek();
    if (f === void 0 || !/[A-Za-z*]/.test(f)) throw C("Invalid token.");
    this.advance();
    while (this.peek() !== void 0 && /[A-Za-z0-9_.*:/!#$%&'+\-^`|~]/.test(this.peek() ?? "")) this.advance();
    return { type: "token", value: this.source.slice(_, this.index) };
  }
};
var A1 = /* @__PURE__ */ new Set(["sf", "bs", "tr", "req", "key", "name"]);
function M(_) {
  let f = (typeof _ === "string" ? _ : _.name).trim().toLowerCase();
  if (!/^@[a-z][a-z0-9-]*$|^[!#$%&'*+.^_`|~0-9a-z-]+$/.test(f)) throw new R("INVALID_OPTIONS", "Invalid component name.");
  if (typeof _ === "string" || _.params === void 0) return { name: f };
  if (Object.keys(_.params).some((N) => !A1.has(N))) throw new R("INVALID_OPTIONS", "Unsupported component parameter.");
  let w = {};
  for (let [N, U] of Object.entries(_.params)) {
    if ((N === "key" || N === "name") && typeof U !== "string") throw new R("INVALID_OPTIONS", `Invalid ${N} component parameter.`);
    if (N !== "key" && N !== "name" && U !== true) throw new R("INVALID_OPTIONS", `Invalid ${N} component parameter.`);
    Object.assign(w, { [N]: U });
  }
  return Object.keys(w).length === 0 ? { name: f } : { name: f, params: w };
}
function r(_) {
  return _.map(M);
}
function E(_) {
  let f = M(_), w = {};
  for (let [N, U] of Object.entries(f.params ?? {})) w[N] = U;
  return c({ value: f.name, params: w });
}
function h(_, f) {
  let w = M(_), N = M(f);
  if (w.name !== N.name) return false;
  let U = w.params ?? {}, $ = N.params ?? {};
  return [.../* @__PURE__ */ new Set([...Object.keys(U), ...Object.keys($)])].every((I) => U[I] === $[I]);
}
function u(_, f) {
  return _.some((w) => h(w, f));
}
function A_(_) {
  return /^[\x20-\x7e]{1,128}$/.test(_);
}
async function Nf(_) {
  let f = typeof _.nonce === "string" ? _.nonce : typeof _.nonce === "function" ? await _.nonce() : o8(p8(16));
  if (!A_(f) || f.length < 16) throw new R("INVALID_OPTIONS", "Nonce must be an ASCII String no more than 128 bytes; signers must provide at least 128 bits of randomness.");
  return f;
}
function p(_, f) {
  if (!Number.isSafeInteger(_) || _ <= 0) throw new R("INVALID_OPTIONS", "chainId must be positive integer.");
  if (!/^0x[a-fA-F0-9]{40}$/.test(f)) throw new R("INVALID_OPTIONS", "address must be 20-byte hex.");
  return `eip155:${_}:${f.toLowerCase()}`;
}
var G1 = BigInt(Number.MAX_SAFE_INTEGER);
var C1 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
var T1 = new TextEncoder();
var R_ = "erc8128";
var e = "erc8128-delegated";
var Y8 = new TextEncoder();
var S1 = /* @__PURE__ */ new Set(["sf", "bs", "tr", "req", "key", "name"]);
function W8(_) {
  let f = d(_), w = /* @__PURE__ */ new Map();
  for (let U of H8(_)) {
    let $ = U.indexOf("=");
    if ($ <= 0) continue;
    w.set(U.slice(0, $).trim(), U.slice($ + 1).trim());
  }
  let N = [];
  for (let [U, $] of Object.entries(f)) try {
    if (D_(U), !("items" in $)) throw new R("PARSE_ERROR", "Signature-Input members must be Inner Lists.");
    let J = $.params?.tag, I = J === R_ || J === e;
    if ($.items.length > 32 || Object.keys($.params ?? {}).length > 16) {
      if (I) throw new R("LIMIT_EXCEEDED", "Signature candidate exceeds its component or parameter limit.");
      continue;
    }
    let j = $.items.map(Qf);
    if (j.length === 0) throw new R("PARSE_ERROR", "Signature component list is empty.");
    if (new Set(j.map(E)).size !== j.length) throw new R("PARSE_ERROR", "Covered components must not be repeated.");
    let D = B1($);
    N.push({ label: U, components: j, params: D, signatureParamsValue: w.get(U) ?? c($) });
  } catch (J) {
    if (J instanceof R && J.code === "LIMIT_EXCEEDED") throw J;
    if (!(J instanceof R && J.code === "PARSE_ERROR")) throw J;
  }
  return N;
}
function X8(_) {
  let f = d(_), w = /* @__PURE__ */ new Map();
  for (let [N, U] of Object.entries(f)) {
    if (D_(N), !("value" in U) || typeof U.value !== "object" || U.value.type !== "binary" || Object.keys(U.params ?? {}).length !== 0 || U.value.value.length === 0) continue;
    w.set(N, O1(U.value.value));
  }
  return w;
}
function F_(_) {
  return W8(_);
}
function V8(_) {
  return X8(_);
}
function H8(_) {
  let f = [], w = 0, N = false, U = false, $ = false, J = 0;
  for (let I = 0; I < _.length; I += 1) {
    let j = _[I];
    if (N) {
      if ($) $ = false;
      else if (j === "\\") $ = true;
      else if (j === '"') N = false;
      continue;
    }
    if (U) {
      if (j === ":") U = false;
      continue;
    }
    if (j === '"') N = true;
    else if (j === ":") U = true;
    else if (j === "(") J += 1;
    else if (j === ")") J -= 1;
    else if (j === "," && J === 0) f.push(_.slice(w, I)), w = I + 1;
  }
  return f.push(_.slice(w)), f;
}
function D_(_) {
  if (!/^[a-z*][a-z0-9_.*-]*$/.test(_)) throw new R("PARSE_ERROR", `Invalid signature label: ${_}`);
}
function Qf(_) {
  if (typeof _.value !== "string") throw new R("PARSE_ERROR", "Covered components must be strings.");
  let f = {};
  for (let [N, U] of Object.entries(_.params ?? {})) {
    if (!S1.has(N)) throw new R("PARSE_ERROR", `Unknown component parameter: ${N}.`);
    if (N === "key" || N === "name") {
      if (typeof U !== "string") throw new R("PARSE_ERROR", `Component ${N} must be a string.`);
      Object.assign(f, { [N]: U });
    } else {
      if (U !== true) throw new R("PARSE_ERROR", `Component ${N} must be bare true.`);
      Object.assign(f, { [N]: true });
    }
  }
  let w;
  try {
    w = M(Object.keys(f).length === 0 ? { name: _.value } : { name: _.value, params: f });
  } catch {
    throw new R("PARSE_ERROR", "Invalid component identifier.");
  }
  if (w.name !== _.value) throw new R("PARSE_ERROR", "Component identifiers must use canonical lowercase names.");
  return w;
}
function B1(_) {
  let f = _.params ?? {}, w = f.created, N = f.alg, U = f.expires, $ = f.keyid, J = f.nonce, I = f.tag;
  return { created: Number.isInteger(w) ? w : Number.NaN, expires: Number.isInteger(U) ? U : Number.NaN, keyid: typeof $ === "string" ? $ : "", ...N === void 0 ? {} : { alg: N }, ...J === void 0 ? {} : { nonce: typeof J === "string" ? J : "\0" }, ...typeof I === "string" ? { tag: I } : {} };
}
function O1(_) {
  let w = "";
  for (let N = 0; N < _.length; N += 3) {
    let U = _[N] ?? 0, $ = _[N + 1] ?? 0, J = _[N + 2] ?? 0, I = U << 16 | $ << 8 | J;
    w += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[I >> 18 & 63], w += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[I >> 12 & 63], w += N + 1 < _.length ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[I >> 6 & 63] : "=", w += N + 2 < _.length ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[I & 63] : "=";
  }
  return w;
}
async function K8(_, f, w) {
  let N = new Headers(_.headers), U = N.get("content-digest");
  if (f === "off") throw new R("DIGEST_REQUIRED", "content-digest is required by covered components, but contentDigest='off'.");
  if (f === "require" && !U) throw new R("DIGEST_REQUIRED", "content-digest is required but missing.");
  if (U && (f === "auto" || f === "require")) {
    let j = w ?? await s(_);
    if (!await G8(_, j)) throw new R("BAD_HEADER_VALUE", "content-digest does not match the request content.");
    return _;
  }
  let $ = w ?? await s(_), J = await r_($), I = m(J);
  return N.set("content-digest", `sha-256=:${I}:`), new Request(_, { headers: N });
}
async function G8(_, f) {
  let w = _.headers.get("content-digest");
  if (!w) return false;
  let N = c1(w);
  if (!N) return false;
  let U = f ?? await s(_), $ = /* @__PURE__ */ new Map(), J = 0;
  for (let I of N) {
    if (I.alg !== "sha-256" && I.alg !== "sha-512") continue;
    let j = $.get(I.alg);
    if (j === void 0) j = m(I.alg === "sha-256" ? await r_(U) : sha512(U)), $.set(I.alg, j);
    if (J += 1, !m1(I.b64, j)) return false;
  }
  return J > 0;
}
function c1(_) {
  try {
    let f = d(_), w = [];
    for (let [N, U] of Object.entries(f)) {
      if (N !== "sha-256" && N !== "sha-512") continue;
      if (!("value" in U) || typeof U.value !== "object" || U.value.type !== "binary" || U.value.value.length !== (N === "sha-256" ? 32 : 64)) return null;
      w.push({ alg: N.toLowerCase(), b64: m(U.value.value) });
    }
    return w.length === 0 ? null : w;
  } catch {
    return null;
  }
}
function m1(_, f) {
  if (_.length !== f.length) return false;
  let w = 0;
  for (let N = 0; N < _.length; N++) w |= _.charCodeAt(N) ^ f.charCodeAt(N);
  return w === 0;
}
function Ff(_, f) {
  return c({ items: r(_).map((w) => ({ value: w.name, params: w.params })), params: { created: f.created, expires: f.expires, ...f.nonce === void 0 ? {} : { nonce: f.nonce }, keyid: f.keyid, ...f.tag === void 0 ? {} : { tag: f.tag } } });
}
function hf(_) {
  if (!Number.isInteger(_.created) || !Number.isInteger(_.expires)) throw new R("INVALID_OPTIONS", "created/expires must be integers.");
  if (_.expires <= _.created) throw new R("INVALID_OPTIONS", "expires must be > created.");
  if (!_.keyid) throw new R("INVALID_OPTIONS", "keyid is required.");
}
function xf(_, f) {
  return D_(_), `${_}=${f}`;
}
function kf(_, f) {
  if (D_(_), !/^[A-Za-z0-9+/]+={0,2}$/.test(f)) throw new R("BAD_HEADER_VALUE", "Signature must be base64.");
  return `${_}=:${f}:`;
}
function C8(_, f) {
  if (!_) return f;
  return `${_}, ${f}`;
}
function Pf(_) {
  return c({ value: _ });
}
function Mf(_) {
  return r(_);
}
function u1(_) {
  let { binding: f, hasBody: w } = _;
  if (f === "class-bound") return [{ name: "@authority" }];
  let N = [{ name: "@scheme" }, { name: "@authority" }, { name: "@method" }, { name: "@path" }, { name: "@query" }];
  if (w) N.push({ name: "content-digest" });
  return N;
}
function zf(_) {
  let { binding: f, hasQuery: w, hasBody: N, providedComponents: U } = _;
  if (f === "request-bound") {
    let J = u1({ binding: f, hasQuery: w, hasBody: N });
    if (!U) return J;
    let I = Mf(U).filter((j) => !J.some((D) => h(D, j)));
    return J.concat(I);
  }
  if (!U) throw new R("INVALID_OPTIONS", "components are required for class-bound signatures.");
  let $ = Mf(U);
  if (!$.some((J) => J.name === "@authority")) $.unshift({ name: "@authority" });
  return $;
}
function X_(_) {
  let { request: f, components: w, signatureParamsValue: N } = _, U = O(f.url), $ = [];
  for (let j of w) {
    let D = M(j), Y = o1({ request: f, url: U, component: D });
    if (/[^\x20-\x7E]/.test(Y) || Y.includes("\r") || Y.includes(`
`)) throw new R("BAD_DERIVED_VALUE", `Component ${D.name} produced invalid characters.`);
    $.push(`${E(D)}: ${Y}`);
  }
  let J = `${Pf("@signature-params")}: ${N}`, I = $.length ? `${$.join(`
`)}
${J}` : J;
  return q_(I);
}
function o1(_) {
  let { request: f, url: w, component: N } = _;
  if (N.params?.req || N.params?.tr || N.params?.name) throw new R("BAD_DERIVED_VALUE", `Component ${N.name} uses parameters unavailable in Fetch requests.`);
  switch (N.name) {
    case "@scheme":
      return w.protocol.slice(0, -1).toLowerCase();
    case "@method": {
      let U = (f.method || "GET").toUpperCase();
      return P_(U, "@method"), U;
    }
    case "@authority": {
      let U = w.protocol.replace(":", "").toLowerCase(), $ = w.hostname.toLowerCase(), J = w.port, I = $;
      if (J) {
        let j = Number(J);
        if (!(U === "http" && j === 80 || U === "https" && j === 443)) I = `${$}:${J}`;
      }
      return P_(I, "@authority"), I;
    }
    case "@path": {
      let U = w.pathname || "/";
      return P_(U, "@path"), U;
    }
    case "@query": {
      let U = w.search || "?";
      return P_(U, "@query"), U;
    }
    default: {
      let U = f.headers.get(N.name);
      if (U == null) throw new R("BAD_HEADER_VALUE", `Required header "${N.name}" is missing.`);
      if (N.params?.bs && N.params?.sf) throw new R("BAD_DERIVED_VALUE", "The bs and sf component parameters cannot be combined.");
      let $ = Sf(U);
      if (N.params?.sf) $ = N.params.key ? n1(U, N.params.key) : e_(U);
      else if (N.params?.key) throw new R("BAD_DERIVED_VALUE", "The key component parameter requires sf.");
      if (N.params?.bs) $ = c({ value: { type: "binary", value: new TextEncoder().encode(Sf(U)) } });
      return P_($, N.name), $;
    }
  }
}
function n1(_, f) {
  let w = d(_)[f];
  if (w === void 0) throw new R("BAD_DERIVED_VALUE", `Structured Field Dictionary has no ${f} member.`);
  return c(w);
}
function Sf(_) {
  return _.trim();
}
function P_(_, f) {
  if (_.includes("\r") || _.includes(`
`)) throw new R("BAD_DERIVED_VALUE", `${f} contains CR/LF.`);
}
function m_(_, f) {
  try {
    return /* @__PURE__ */ new Set([..._ === null ? [] : F_(_).map(({ label: w }) => w), ...f === null ? [] : V8(f).keys()]);
  } catch {
    throw new R("PARSE_ERROR", "Existing signature dictionaries are malformed.");
  }
}
function Bf(_, f) {
  let w = /^[a-z*][a-z0-9_.*-]*$/.test(_) ? _ : "sig";
  if (!f.has(w)) return w;
  for (let N = 1; N < 100; N += 1) {
    let U = `${w}${N}`;
    if (!f.has(U)) return U;
  }
  throw new R("INVALID_OPTIONS", "No collision-free signature label available.");
}
var u_ = (_, f, w) => {
  let N = _ ?? globalThis.fetch;
  if (typeof N !== "function") throw new R("UNSUPPORTED_REQUEST", "No fetch implementation available.");
  return N === globalThis.fetch ? globalThis.fetch(f, w) : N(f, w);
};
var Of = /* @__PURE__ */ Symbol("ERC-8128 signature tag");
async function l_(_, f, w, N) {
  let U, $, J;
  if (s_(f)) $ = f, J = w;
  else U = f, $ = w, J = N;
  let I = J ?? {};
  return Ef(i_(_, U), $, I);
}
async function Ef(_, f, w, N) {
  let U = N ?? (_.body === null ? new Uint8Array() : await s(_)), $ = _.body === null ? _ : new Request(_, { body: i1(U) }), J = Bf(w.label ?? "request", m_($.headers.get("signature-input"), $.headers.get("signature"))), I = w.binding ?? "request-bound", j = w.contentDigest ?? "auto", D = i(), Y = w.created ?? D, V = w.ttlSeconds ?? 60, L = w.expires ?? Y + V, X = w.nonce === null ? void 0 : await Nf(w), Q = p(f.chainId, f.address), H = O($.url).search.length > 0, A = U.length > 0, K = zf({ binding: I, hasQuery: H, hasBody: A, providedComponents: w.components });
  if ($.headers.has("content-type") && !u(K, "content-type")) K.push({ name: "content-type" });
  if ($.headers.has("content-digest") && !u(K, "content-digest")) K.push({ name: "content-digest" });
  let Z = $;
  if (u(K, "content-digest")) Z = await K8(Z, j, U);
  else if (A) K = [...K, { name: "content-digest" }], Z = await K8(Z, j, U);
  let B = { created: Y, expires: L, keyid: Q, tag: w[Of] ?? R_, ...X ? { nonce: X } : {} };
  hf(B);
  let b = Ff(K, B), v = xf(J, b), k = X_({ request: Z, components: K, signatureParamsValue: b }), n = await f.signMessage(k), F = P(n);
  if (F.length === 0 || F.length > 8192) throw new R("UNSUPPORTED_REQUEST", "Signer returned a signature outside the supported size.");
  let G = m(F), z = kf(J, G), S = new Headers(Z.headers), t = C8(S.get("Signature-Input"), v), w_ = C8(S.get("Signature"), z);
  if (new TextEncoder().encode(t).length > 16384 || new TextEncoder().encode(w_).length > 16384) throw new R("UNSUPPORTED_REQUEST", "Signature fields exceed the supported size.");
  return S.set("Signature-Input", t), S.set("Signature", w_), new Request(Z, { headers: S });
}
async function p_(_, f, w, N) {
  let U = i_(_, f), $ = await N(U) ?? {}, J = await Ef(U, w, $);
  return u_($.fetch, J);
}
function i1(_) {
  return new Uint8Array(_).buffer;
}
function Y_(_, f, w) {
  if (!w) return;
  let N = _.toUpperCase();
  if (f in w) return T8(N, w[f]);
  let U;
  for (let [$, J] of Object.entries(w)) {
    if ($ === "default" || !$.endsWith("/*") || J === void 0) continue;
    let I = $.slice(0, -1);
    if (!f.startsWith(I)) continue;
    if (!U || I.length > U.prefixLen) U = { candidate: J, prefixLen: I.length };
  }
  if (U) return T8(N, U.candidate);
  return T8(N, w.default);
}
function T8(_, f) {
  if (!f) return;
  let w = Array.isArray(f) ? f : [f], N;
  for (let U of w) {
    let $ = U.methods;
    if (!$ || $.length === 0) {
      N ??= U;
      continue;
    }
    if ($.some((J) => J.toUpperCase() === _)) return U;
  }
  return N;
}
function y(_) {
  if (!_) return [];
  let f = [];
  for (let w of _) {
    let N = M(w);
    if (!f.some((U) => h(U, N))) f.push(N);
  }
  return f;
}
var vf = ["request-bound", "class-bound"];
var gf = ["non-replayable", "replayable"];
var df = ["auto", "recompute", "require", "off"];
var s1 = new Set(vf);
var r1 = new Set(gf);
var a1 = new Set(df);
var z_ = (_) => /^[a-z0-9][a-z0-9!#$%&'*+.^_`|~-]*$/.test(_);
function o_(_, f) {
  let w = y(f);
  for (let N of w) {
    let U = N.params;
    if (!z_(N.name) || U?.req || U?.tr || U?.name !== void 0 || U?.bs && U?.sf || U?.key && !U.sf) throw new R("INVALID_OPTIONS", "requiredCoveredHeadersWhenPresent must contain request-header components.");
  }
  return w.filter((N) => _.headers.has(N.name));
}
function n_(_, f) {
  return y([...o_(_, f?.requiredCoveredHeadersWhenPresent), ...f?.contentDigest === "require" ? ["content-digest"] : []]);
}
var cf = { off: 0, auto: 1, recompute: 2, require: 2 };
function Z_(_, f) {
  let w = f0(f);
  if (_ === void 0) return w;
  if (w === void 0) return _;
  return cf[w] >= cf[_] ? w : _;
}
function f0(_) {
  if (_ === "require") return "recompute";
  if (_ === "off") return "auto";
  return _;
}
var t_ = (_) => _ !== void 0 && Number.isSafeInteger(_) && _ > 0 ? _ : void 0;
var rf = (..._) => {
  let f = [];
  for (let w of _) for (let N of w ?? []) {
    let U = M(N);
    if (f.some(($) => h($, U))) continue;
    f.push(U);
  }
  return f;
};
var F0 = (_, f) => {
  if (f === void 0) return;
  if (f.length === 0) return;
  return (Array.isArray(f[0]) ? f : [f]).reduce((N, U) => {
    let $ = U.filter((I) => !_.some((j) => h(j, I))).length, J = N.filter((I) => !_.some((j) => h(j, I))).length;
    return $ < J ? U : N;
  });
};
var b8 = ({ authorizationPolicy: _, invalidationAvailable: f = false, preferReplayable: w = _.preferReplayable, remainingAuthorizationSeconds: N, requestOptions: U = {}, routeMaxValiditySeconds: $, routePolicy: J }) => {
  if (N !== void 0 && N <= 0) throw Error("The authorization has expired.");
  let I = U.nonce === null, j = U.nonce !== void 0 && U.nonce !== null, D = _.preferReplayable && !j && (I || w) && J?.replayable === true && f, Y = _.binding === "class-bound", V = U.binding === void 0 || U.binding === "class-bound", L = Y && V ? F0(_.components, J?.classBoundPolicies) : void 0, X = L === void 0 ? "request-bound" : "class-bound", Q = X === "class-bound" ? rf(["@authority"], L, _.components, U.components, J?.additionalRequestBoundComponents) : rf(_.components, U.components, J?.additionalRequestBoundComponents), W = [t_(_.ttlSeconds), t_(U.ttlSeconds), t_($), t_(N)].filter((H) => H !== void 0);
  if (W.length === 0) throw Error("Authorized posture requires a positive validity cap.");
  return { binding: X, components: Q, contentDigest: Z_(U.contentDigest, J?.contentDigest) ?? "auto", replay: D ? "replayable" : "non-replayable", ttlSeconds: Math.min(...W) };
};
function g8(_, f, w, N, U) {
  let $ = af(N.ttlSeconds) ?? 60, J = af(w?.max_validity_sec) ?? Number.POSITIVE_INFINITY;
  if (!w) return { binding: N.binding, replay: U, components: N.components, contentDigest: N.contentDigest, defaultTtlSeconds: $, maximumTtlSeconds: J };
  let I = Y_(_, f, w.route_policies), j = U === "replayable" && I?.replayable !== false;
  if (N.binding === "class-bound" && I != null && I.classBoundPolicies !== void 0 && I.classBoundPolicies.length > 0) {
    let L = v8(h0(N.components ?? [], I?.classBoundPolicies), I?.additionalRequestBoundComponents ?? []);
    return { binding: "class-bound", replay: j ? "replayable" : "non-replayable", components: L, contentDigest: Z_(N.contentDigest, I?.contentDigest), defaultTtlSeconds: $, maximumTtlSeconds: J };
  }
  let Y = I?.additionalRequestBoundComponents, V = Y ? v8(N.components ?? [], Y) : N.components;
  return { binding: "request-bound", replay: j ? "replayable" : "non-replayable", components: V?.length ? V : void 0, contentDigest: Z_(N.contentDigest, I?.contentDigest), defaultTtlSeconds: $, maximumTtlSeconds: J };
}
function af(_) {
  return Number.isSafeInteger(_) && (_ ?? 0) > 0 ? _ : void 0;
}
function h0(_, f) {
  if (f === void 0) return _;
  if (f.length === 0) return _;
  let w = Array.isArray(f[0]) ? f : [f], N = w[0], U = 1 / 0;
  for (let $ of w) {
    let J = $.filter((I) => !_.some((j) => h(j, I))).length;
    if (J < U) U = J, N = $;
  }
  return v8(N ?? [], _);
}
function v8(..._) {
  let f = [];
  for (let w of _) for (let N of w) {
    let U = M(N);
    if (!f.some(($) => h($, U))) f.push(U);
  }
  return f;
}
var O0 = /* @__PURE__ */ new Set(["method", "headers", "body", "signal", "credentials", "mode", "cache", "redirect", "referrer", "integrity", "keepalive", "window"]);
function E0(_) {
  if (!_ || typeof _ !== "object") return false;
  for (let f of O0) if (f in _) return true;
  return false;
}
function m8(_, f) {
  if (f !== void 0) return { init: _, opts: f };
  if (E0(_)) return { init: _ };
  return { opts: _ };
}
function q0(_) {
  let f = O(_.url);
  return { origin: f.origin, method: _.method.toUpperCase(), pathname: f.pathname };
}
function J1(_) {
  let f;
  try {
    f = new URL(_);
  } catch {
    throw new R("INVALID_OPTIONS", `Server config key must be an absolute HTTP(S) origin: ${_}`);
  }
  if (f.protocol !== "https:" && f.protocol !== "http:" || f.username !== "" || f.password !== "" || f.pathname !== "/" || f.search !== "" || f.hash !== "") throw new R("INVALID_OPTIONS", `Server config key must contain only an HTTP(S) origin: ${_}`);
  return f.origin;
}
function y0(_, f) {
  let { authorizationExpiresAt: w, authorizationPolicy: N, serverConfigs: U, preferReplayable: $ = false, ...J } = f ?? {}, I = new Map(U ? Object.entries(U).map(([L, X]) => [J1(L), X]) : []);
  function j(L, X) {
    let Q = { ...J, ...L }, W = Q.nonce === null || Q.nonce === void 0 && $ ? "replayable" : "non-replayable", { origin: H, method: A, pathname: K } = q0(X), Z = I.get(H), B = Y_(A, K, Z?.route_policies), b = (G) => {
      let z = n_(X, B);
      if (z.length === 0) return G;
      return { ...G, components: y([...G.components ?? [], ...z]) };
    }, v = Math.floor(Date.now() / 1e3);
    if (N === void 0) {
      let G = g8(A, K, Z, Q, W), z = Q.created ?? v, S = w === void 0 ? Number.POSITIVE_INFINITY : w - z;
      if (S <= 0) throw new R("INVALID_OPTIONS", "The signing authorization has expired.");
      let t = Math.min(G.maximumTtlSeconds, S), w_ = Math.min(Q.expires ?? z + G.defaultTtlSeconds, z + t);
      return b({ ...Q, binding: G.binding, nonce: G.replay === "replayable" ? null : Q.nonce === null ? void 0 : Q.nonce, components: G.components, contentDigest: G.contentDigest, created: z, expires: w_, ttlSeconds: G.defaultTtlSeconds });
    }
    let k = b8({ authorizationPolicy: N, invalidationAvailable: Z?.invalidation_endpoint !== void 0, preferReplayable: W === "replayable", ...w === void 0 ? {} : { remainingAuthorizationSeconds: w - v }, requestOptions: Q, routeMaxValiditySeconds: Z?.max_validity_sec, routePolicy: B }), n = Q.created ?? v, F = Math.min(Q.expires ?? n + k.ttlSeconds, n + k.ttlSeconds, w ?? Number.POSITIVE_INFINITY);
    return b({ ...Q, binding: k.binding, components: k.components, contentDigest: k.contentDigest, created: n, expires: F, nonce: k.replay === "replayable" ? null : Q.nonce === null ? void 0 : Q.nonce, ttlSeconds: k.ttlSeconds });
  }
  return { signRequest: async (L, X, Q) => {
    let { init: W, opts: H } = m8(X, Q), A = new Request(L, W), K = j(H, A);
    return l_(A, _, K);
  }, signedFetch: async (L, X, Q) => {
    let { init: W, opts: H } = m8(X, Q);
    return p_(L, W, _, (A) => j(H, A));
  }, fetch: async (L, X, Q) => {
    let { init: W, opts: H } = m8(X, Q);
    return p_(L, W, _, (A) => j(H, A));
  }, setServerConfig(L, X) {
    let Q = J1(L);
    if (X === null) I.delete(Q);
    else I.set(Q, X);
  } };
}

// ../../node_modules/viem/_esm/accounts/privateKeyToAccount.js
init_secp256k1();
init_toHex();

// ../../node_modules/viem/_esm/accounts/toAccount.js
init_address();
init_isAddress();
function toAccount(source) {
  if (typeof source === "string") {
    if (!isAddress(source, { strict: false }))
      throw new InvalidAddressError({ address: source });
    return {
      address: source,
      type: "json-rpc"
    };
  }
  if (!isAddress(source.address, { strict: false }))
    throw new InvalidAddressError({ address: source.address });
  return {
    address: source.address,
    nonceManager: source.nonceManager,
    sign: source.sign,
    signAuthorization: source.signAuthorization,
    signMessage: source.signMessage,
    signTransaction: source.signTransaction,
    signTypedData: source.signTypedData,
    source: "custom",
    type: "local"
  };
}

// ../../node_modules/viem/_esm/accounts/utils/sign.js
init_secp256k1();
init_isHex();
init_toBytes();
init_toHex();
var extraEntropy = false;
async function sign({ hash: hash2, privateKey, to = "object" }) {
  const { r: r2, s: s2, recovery } = secp256k1.sign(hash2.slice(2), privateKey.slice(2), {
    lowS: true,
    extraEntropy: isHex(extraEntropy, { strict: false }) ? hexToBytes(extraEntropy) : extraEntropy
  });
  const signature = {
    r: numberToHex(r2, { size: 32 }),
    s: numberToHex(s2, { size: 32 }),
    v: recovery ? 28n : 27n,
    yParity: recovery
  };
  return (() => {
    if (to === "bytes" || to === "hex")
      return serializeSignature({ ...signature, to });
    return signature;
  })();
}

// ../../node_modules/viem/_esm/accounts/utils/signAuthorization.js
async function signAuthorization(parameters) {
  const { chainId, nonce, privateKey, to = "object" } = parameters;
  const address2 = parameters.contractAddress ?? parameters.address;
  const signature = await sign({
    hash: hashAuthorization({ address: address2, chainId, nonce }),
    privateKey,
    to
  });
  if (to === "object")
    return {
      address: address2,
      chainId,
      nonce,
      ...signature
    };
  return signature;
}

// ../../node_modules/viem/_esm/accounts/utils/signMessage.js
async function signMessage({ message, privateKey }) {
  return await sign({ hash: hashMessage(message), privateKey, to: "hex" });
}

// ../../node_modules/viem/_esm/accounts/utils/signTransaction.js
init_keccak256();
async function signTransaction(parameters) {
  const { privateKey, transaction, serializer = serializeTransaction } = parameters;
  const signableTransaction = (() => {
    if (transaction.type === "eip4844")
      return {
        ...transaction,
        sidecars: false
      };
    return transaction;
  })();
  const signature = await sign({
    hash: keccak256(await serializer(signableTransaction)),
    privateKey
  });
  return await serializer(transaction, signature);
}

// ../../node_modules/viem/_esm/accounts/utils/signTypedData.js
async function signTypedData(parameters) {
  const { privateKey, ...typedData } = parameters;
  return await sign({
    hash: hashTypedData(typedData),
    privateKey,
    to: "hex"
  });
}

// ../../node_modules/viem/_esm/accounts/privateKeyToAccount.js
function privateKeyToAccount(privateKey, options = {}) {
  const { nonceManager } = options;
  const publicKey2 = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const address2 = publicKeyToAddress(publicKey2);
  const account = toAccount({
    address: address2,
    nonceManager,
    async sign({ hash: hash2 }) {
      return sign({ hash: hash2, privateKey, to: "hex" });
    },
    async signAuthorization(authorization) {
      return signAuthorization({ ...authorization, privateKey });
    },
    async signMessage({ message }) {
      return signMessage({ message, privateKey });
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction({ privateKey, transaction, serializer });
    },
    async signTypedData(typedData) {
      return signTypedData({ ...typedData, privateKey });
    }
  });
  return {
    ...account,
    publicKey: publicKey2,
    source: "privateKey"
  };
}

// ../identity/src/sign-request.ts
function simulationSigner(privateKey, chainId, apiOrigin, targetHost) {
  if (!privateKey || !/^0x[0-9a-f]{64}$/i.test(privateKey)) throw new Error("Set DOUBLEAGENT_ETHEREUM_PRIVATE_KEY to a signing wallet private key (0x + 64 hex digits).");
  if (!/^[1-9][0-9]*$/.test(chainId) || !Number.isSafeInteger(Number(chainId))) throw new Error("Signing chain ID must be a positive safe integer.");
  const url = new URL(apiOrigin);
  if (url.protocol !== "https:" || url.origin !== apiOrigin) throw new Error("--sign-api must be an exact HTTPS origin, without a path or trailing slash.");
  let account;
  try {
    account = privateKeyToAccount(privateKey);
  } catch {
    throw new Error("Invalid Ethereum signing key.");
  }
  const signer = y0({ address: account.address, chainId: Number(chainId), signMessage: (raw) => account.signMessage({ message: { raw } }) });
  return async (request) => {
    const endpoint = new URL(request.url);
    if (endpoint.origin !== apiOrigin || !["/v1/collect", "/v1/check"].includes(endpoint.pathname) || request.method !== "POST") return null;
    const origin = new URL(request.headers.get("origin") ?? "");
    const body = await request.clone().text();
    if (body.length > 65536 || new URL(origin).host !== targetHost || JSON.parse(body)?.page?.host !== targetHost) throw new Error("Refused to sign telemetry for a different website or an oversized body.");
    return signer.signRequest(request, { binding: "request-bound", ttlSeconds: 60, components: ["user-agent", "origin"] });
  };
}

// src/agents.ts
import { mkdir, writeFile } from "node:fs/promises";
import { dirname as dirname2, resolve } from "node:path";

// ../identity/src/erc8004.ts
var RegistryError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
async function boundedJson(response) {
  if (!response.ok || !response.body) throw new RegistryError("rpc_unavailable", "The configured RPC did not return a successful response.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "", size2 = 0;
  try {
    for (; ; ) {
      const { value, done } = await reader.read();
      if (done) break;
      size2 += value.byteLength;
      if (size2 > 131072) throw new RegistryError("rpc_response_too_large", "RPC response exceeded 128 KiB.");
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    await reader.cancel().catch(() => {
    });
    reader.releaseLock();
  }
}
async function resolveAgent(raw, options) {
  const reference = agentReference(raw);
  const reputation = reputationQuery(raw, reference);
  let rpcUrl;
  try {
    rpcUrl = new URL(options.rpcUrl);
  } catch {
    throw new RegistryError("rpc_configuration", "Configure an HTTPS Ethereum RPC URL.");
  }
  if (rpcUrl.protocol !== "https:" || rpcUrl.username || rpcUrl.password) throw new RegistryError("rpc_configuration", "The configured RPC must use HTTPS without embedded credentials.");
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.throwIfAborted();
  options.signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 15e3);
  let requestId = 0;
  const rpc = async (method, params) => {
    const id = ++requestId;
    const response = await (options.fetcher ?? fetch)(rpcUrl.href, {
      method: "POST",
      redirect: "error",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params })
    });
    const body = await boundedJson(response);
    if (!body || body.id !== id || body.jsonrpc !== "2.0" || body.error || !("result" in body))
      throw new RegistryError("rpc_error", "RPC rejected a registry read or returned an invalid response.");
    return body.result;
  };
  try {
    const chain = await rpc("eth_chainId", []);
    if (typeof chain !== "string" || !/^0x[0-9a-f]+$/i.test(chain) || BigInt(chain).toString() !== reference.chain_id)
      throw new RegistryError("wrong_chain", "RPC chain ID does not match the requested registry.");
    const block = await rpc("eth_getBlockByNumber", [options.blockTag ?? "finalized", false]);
    if (!block || typeof block.number !== "string" || !/^0x[0-9a-f]+$/i.test(block.number) || typeof block.hash !== "string" || !/^0x[0-9a-f]{64}$/i.test(block.hash))
      throw new RegistryError("invalid_block", "RPC must support finalized block lookups.");
    const blockNumber = block.number;
    const read = async (to, signature, args = []) => {
      const abi = parseAbi([signature]);
      const functionName = signature.match(/^function (\w+)/)[1];
      const data = encodeFunctionData({ abi, functionName, args });
      const result = await rpc("eth_call", [{ to, data }, blockNumber]);
      if (typeof result !== "string" || !/^0x(?:[0-9a-f]{2})+$/i.test(result)) throw new RegistryError("invalid_contract", "Registry returned empty or malformed contract data.");
      return decodeFunctionResult({ abi, functionName, data: result });
    };
    const token = BigInt(reference.token_id);
    const [owner, uri, wallet] = await Promise.all([
      read(reference.registry_address, "function ownerOf(uint256) view returns (address)", [token]),
      read(reference.registry_address, "function tokenURI(uint256) view returns (string)", [token]),
      read(reference.registry_address, "function getAgentWallet(uint256) view returns (address)", [token])
    ]);
    if (typeof uri !== "string" || uri.length > 16384) throw new RegistryError("invalid_metadata", "Agent URI exceeded the supported size.");
    const snapshot = {
      ...reference,
      standard: "erc-8004",
      registry_status: "registered",
      visit_binding: "unverified",
      owner_address: address(owner, "owner"),
      agent_wallet: wallet === "0x0000000000000000000000000000000000000000" ? null : address(wallet, "agent_wallet"),
      agent_uri: uri,
      metadata_status: "uri-only",
      block_number: BigInt(blockNumber).toString(),
      block_hash: block.hash.toLowerCase(),
      resolved_at: new Date(options.now?.() ?? Date.now()).toISOString(),
      reputation: null,
      reputation_status: "not-requested",
      warnings: []
    };
    if (reputation) {
      try {
        const identity = await read(reputation.registry_address, "function getIdentityRegistry() view returns (address)");
        if (address(identity) !== reference.registry_address) throw new RegistryError("wrong_registry", "Reputation registry belongs to a different identity registry.");
        const [count, value, decimals] = await read(
          reputation.registry_address,
          "function getSummary(uint256,address[],string,string) view returns (uint64,int128,uint8)",
          [token, reputation.reviewers, reputation.tag1, reputation.tag2]
        );
        if (decimals > 18) throw new RegistryError("invalid_reputation", "Unsupported reputation scale.");
        let truncated = false;
        const feedback = (await Promise.all(reputation.reviewers.map(async (reviewer) => {
          const last = await read(reputation.registry_address, "function getLastIndex(uint256,address) view returns (uint64)", [token, reviewer]);
          if (last > 5n) truncated = true;
          const indexes = Array.from({ length: Number(last > 5n ? 5n : last) }, (_, i2) => last - BigInt(i2));
          return Promise.all(indexes.map(async (index) => {
            const [v, d2, tag1, tag2, revoked] = await read(
              reputation.registry_address,
              "function readFeedback(uint256,address,uint64) view returns (int128,uint8,string,string,bool)",
              [token, reviewer, index]
            );
            if (d2 > 18 || tag1.length > 1024 || tag2.length > 1024) throw new RegistryError("invalid_reputation", "Unsupported feedback data.");
            return { reviewer, feedback_index: index.toString(), value: v.toString(), value_decimals: d2, tag1, tag2, revoked };
          }));
        }))).flat().filter((f) => (!reputation.tag1 || f.tag1 === reputation.tag1) && (!reputation.tag2 || f.tag2 === reputation.tag2));
        snapshot.reputation = { query: reputation, count: count.toString(), value: value.toString(), value_decimals: decimals, feedback, feedback_limit_per_reviewer: 5, feedback_truncated: truncated };
        snapshot.reputation_status = "resolved";
      } catch {
        snapshot.reputation_status = "unavailable";
        snapshot.warnings.push("Reputation could not be resolved. No rating was substituted.");
      }
    }
    const confirm = await rpc("eth_getBlockByNumber", [blockNumber, false]);
    if (confirm?.hash?.toLowerCase() !== snapshot.block_hash) throw new RegistryError("block_changed", "Registry block changed during lookup; retry.");
    return snapshot;
  } catch (error) {
    if (error instanceof RegistryError) throw error;
    throw new RegistryError(controller.signal.aborted ? "rpc_timeout" : "registry_unavailable", "Could not resolve the registry with the configured RPC.");
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}

// src/agents.ts
var AGENTS_HELP = `doubleagent agents resolve --agent-name acme.shopping-assistant --token-id 22 [options]

  --chain-id <decimal>          Chain ID (default 1, Ethereum)
  --registry <address>          Identity contract (default official Ethereum registry)
  --reviewers <addresses>       Comma-separated trusted reviewers, at most 5; opt-in reputation reads
  --reputation-registry <addr>  Required for reputation on a custom chain/identity registry
  --tag1 <tag> --tag2 <tag>      Reputation metric filters; values keep their original scale
  --output <path>              Save the resolved snapshot JSON
  --site <site-id>              Resolve and save a site association through the authenticated API
  --api <origin>               API origin for site associations
  --json                       Print machine-readable output

Direct lookups need DOUBLEAGENT_ETHEREUM_RPC_URL (HTTPS). Site lookups use the API's ERC8004_RPC_URLS.
doubleagent agents list --site st_... [--agent-name acme.shopping-assistant] [--json]
doubleagent agents remove <association-id> --site st_... [--json]

Names follow operator.agent-name. Lookups prove registry membership, not who controls a browser.
No wallet, gas payment or chain transaction is needed. Remote registration/review documents are not fetched.`;
function identityFlags(flags) {
  return {
    agent_name: flags["agent-name"],
    token_id: flags["token-id"],
    chain_id: flags["chain-id"],
    registry_address: flags.registry,
    reviewers: typeof flags.reviewers === "string" ? flags.reviewers.split(",").map((s2) => s2.trim()) : flags.reviewers,
    reputation_registry: flags["reputation-registry"],
    tag1: flags.tag1,
    tag2: flags.tag2
  };
}
async function resolveIdentityFlags(flags, io) {
  const raw = identityFlags(flags);
  try {
    reputationQuery(raw, agentReference(raw));
  } catch (error) {
    throw new CliError(error.message);
  }
  const rpcUrl = io.env.DOUBLEAGENT_ETHEREUM_RPC_URL;
  if (!rpcUrl) throw new CliError("Set DOUBLEAGENT_ETHEREUM_RPC_URL to an HTTPS RPC for the requested chain.");
  try {
    return await resolveAgent(raw, { rpcUrl, fetcher: io.fetch });
  } catch (error) {
    throw new CliError(error.message);
  }
}
async function agentsCmd(args, io) {
  const [action, id] = args.pos;
  const allowed = /* @__PURE__ */ new Set(["agent-name", "token-id", "chain-id", "registry", "reviewers", "reputation-registry", "tag1", "tag2", "output", "site", "api", "json"]);
  for (const [key, value] of Object.entries(args.flags)) {
    if (!allowed.has(key)) throw new CliError(`unknown agents option --${key}`);
    if (key === "json" && value !== true || key !== "json" && typeof value !== "string") throw new CliError(`invalid --${key}`);
  }
  if (!["resolve", "list", "remove"].includes(action) || args.pos.length > (action === "remove" ? 2 : 1)) throw new CliError(AGENTS_HELP);
  const site = str(args.flags.site);
  const path = site ? `/v1/sites/${encodeURIComponent(site)}/agent-identities` : "";
  let result;
  if (action === "resolve") {
    const raw = identityFlags(args.flags);
    try {
      reputationQuery(raw, agentReference(raw));
    } catch (error) {
      throw new CliError(error.message);
    }
    result = site ? (await sessionApi(args, io).api.request("POST", path, raw)).data : await resolveIdentityFlags(args.flags, io);
  } else {
    if (!site) throw new CliError("--site is required.");
    if (action === "list") result = (await sessionApi(args, io).api.request("GET", path + (args.flags["agent-name"] ? `?agent_name=${encodeURIComponent(String(args.flags["agent-name"]))}` : ""))).data;
    else {
      if (!id) throw new CliError("Supply the association ID to remove.");
      await sessionApi(args, io).api.request("DELETE", `${path}/${encodeURIComponent(id)}`);
      result = { removed: id };
    }
  }
  if (args.flags.output) {
    const output = resolve(io.cwd, String(args.flags.output));
    await mkdir(dirname2(output), { recursive: true });
    await writeFile(output, JSON.stringify(result, null, 2) + "\n");
  }
  io.out(JSON.stringify(result, null, 2));
  if (!args.flags.json) io.out("Registry association only. Website visit identity remains unverified.");
  return 0;
}

// src/simulation/command.ts
var SIMULATE_HELP = `doubleagent simulate <url> [options]

  --url <url>                  Alternative to the positional URL
  --scenario observe|bot|agent Observe, repeated automation, or pause-and-act pattern (default observe)
  --evidence behavior|marker  Trusted input pattern or injected marker (default behavior)
  --pause <milliseconds>       Pause between actions, 100\u201310000 (agent 2200, bot 350)
  --agent <catalog-id>         Marker mode agent (default browser-use.agent; use --list)
  --profile <profile>          Detector profile (default generic)
  --duration <seconds>         2\u2013120 (default 20)
  --delay <milliseconds>       First action / marker delay (default 1500)
  --scroll <pixels>            Bounded scroll per interval; 0 disables (default 0)
  --interval <milliseconds>    Scroll interval, 250\u201310000 (default 1500)
  --user-agent <string>        Browser UA override; does not verify identity
  --headed                    Show Chromium (default headless)
  --report                    Allow installed SDK reporting; writes synthetic visits to its configured account
  --output <file>              JSON report (default doubleagent-simulation.json)
  --json                      Print the report as JSON; no progress output
  --agent-name <name>          Declare operator.agent-name in the browser's User-Agent
  --token-id <decimal>         Also declare an ERC-8004 reference (used with --agent-name)
  --sign-requests              Sign SDK collect/check requests using DOUBLEAGENT_ETHEREUM_PRIVATE_KEY; requires --report
  --sign-api <https-origin>    Exact telemetry API origin to sign (required with --sign-requests)
  --sign-chain-id <id>         Signing chain (default registry chain, otherwise 1)
  --resolve-identity           Attach a live registry lookup; requires the RPC environment variable
  --chain-id <decimal>         Identity chain (default 1); RPC from DOUBLEAGENT_ETHEREUM_RPC_URL
  --registry <address>         Identity registry override; required for other chains
  --reviewers <addresses>      Optional reputation reviewers (comma-separated, max 5)
  --reputation-registry <addr> Reputation registry override
  --tag1 <tag> --tag2 <tag>     Reputation metric filters
  --list                      List available agents and profiles; no browser needed
  --install-browser           Install Chromium for Playwright (Node 20+)

Isolated by default. Behavior patterns use temporary test controls on the page; site forms are not submitted.
Fixture assertions check evidence, not real-agent identity. Use a normal browser for human controls.`;
async function simulateCmd(args, io) {
  const identityKeys = ["agent-name", "token-id", "chain-id", "registry", "reviewers", "reputation-registry", "tag1", "tag2"];
  const allowed = /* @__PURE__ */ new Set(["url", "scenario", "evidence", "pause", "agent", "profile", "duration", "delay", "scroll", "interval", "user-agent", "headed", "report", "output", "json", "list", "install-browser", "resolve-identity", "sign-requests", "sign-api", "sign-chain-id", ...identityKeys]);
  for (const key of Object.keys(args.flags)) if (!allowed.has(key)) throw new CliError(`unknown simulate option --${key}`);
  for (const key of ["headed", "report", "json", "list", "install-browser", "resolve-identity", "sign-requests"])
    if (args.flags[key] !== void 0 && args.flags[key] !== true) throw new CliError(`--${key} does not take a value`);
  if (args.flags.output === true) throw new CliError("--output needs a file path");
  for (const key of identityKeys) if (args.flags[key] !== void 0 && typeof args.flags[key] !== "string") throw new CliError(`--${key} needs a value`);
  if (args.flags.list) {
    io.out(JSON.stringify({ scenarios: ["observe", "bot", "agent"], agents: SIMULATED_AGENTS, profiles: SITE_PROFILES }, null, 2));
    return 0;
  }
  if (args.flags["install-browser"]) {
    await installSimulationBrowser(io.cwd);
    io.out(args.flags.json ? JSON.stringify({ installed: "chromium" }) : "Chromium installed.");
    return 0;
  }
  if (args.pos.length > 1 || args.pos.length && args.flags.url) throw new CliError("Supply one URL, either positional or --url.");
  let options;
  try {
    options = siteOptions({ ...args.flags, url: str(args.flags.url) ?? args.pos[0], userAgent: args.flags["user-agent"] });
  } catch (error) {
    throw new CliError(error.message);
  }
  if (identityKeys.some((key) => key !== "agent-name" && args.flags[key] !== void 0) && !args.flags["agent-name"]) throw new CliError("--agent-name is required for an identity declaration.");
  if (args.flags["token-id"] === void 0 && ["chain-id", "registry"].some((key) => args.flags[key] !== void 0)) throw new CliError("--token-id is required for a registry reference.");
  if (!args.flags["resolve-identity"] && ["reviewers", "reputation-registry", "tag1", "tag2"].some((key) => args.flags[key] !== void 0)) throw new CliError("Reputation options need --resolve-identity.");
  if (args.flags["sign-requests"] && (!options.report || typeof args.flags["sign-api"] !== "string")) throw new CliError("--sign-requests requires --report and --sign-api <https-origin>.");
  if (!args.flags["sign-requests"] && ["sign-api", "sign-chain-id"].some((key) => args.flags[key] !== void 0)) throw new CliError("Signing options require --sign-requests.");
  const signRequest = args.flags["sign-requests"] ? simulationSigner(io.env.DOUBLEAGENT_ETHEREUM_PRIVATE_KEY, String(args.flags["sign-chain-id"] ?? args.flags["chain-id"] ?? "1"), String(args.flags["sign-api"]), new URL(options.url).host) : void 0;
  const identity = args.flags["resolve-identity"] ? await resolveIdentityFlags(args.flags, io) : void 0;
  if (!args.flags.json) {
    io.out(`Browser: ${options.headed ? "visible Chromium; closes when the run finishes" : "headless; add --headed to see the browser"}.`);
    io.out(`Dashboard reporting: ${options.report ? "enabled through the installed SDK; this creates synthetic visits" : "OFF (isolated); add --report to send this visit"}.`);
  }
  let previous = "";
  const report = await runSiteSimulation(options, {
    cwd: io.cwd,
    signRequest,
    onStatus: (message) => {
      if (!args.flags.json) io.out(message);
    },
    onAction: (action) => {
      if (!args.flags.json) io.out(`${(action.elapsedMs / 1e3).toFixed(1)}s  Action ${action.step}: ${action.description}`);
    },
    onCollection: (receipt) => {
      if (!args.flags.json) io.out(`Collection ${receipt.outcome}${receipt.status === null ? "" : ` (HTTP ${receipt.status})`}: ${receipt.endpoint}${receipt.sessionId ? `; SDK session ${receipt.sessionId}` : ""}${receipt.reason ? `; ${receipt.reason}` : ""}`);
    },
    onSnapshot: (snapshot) => {
      const code = snapshot.behaviorOnly.class + ":" + snapshot.verdict.class + ":" + Boolean(snapshot.injected) + ":" + snapshot.installed.verdict?.class;
      if (!args.flags.json && code !== previous) {
        previous = code;
        io.out(`${(snapshot.elapsedMs / 1e3).toFixed(1)}s  ${snapshot.verdict.class}  ${snapshot.injected ? `fixture: ${snapshot.injected.reason}` : `behavior-only: ${snapshot.behaviorOnly.class}`}  installed SDK: ${snapshot.installed.verdict?.class ?? "unavailable"}`);
      }
    }
  });
  if (identity) report.registry_identity = { ...identity, association: "simulation-parameter", visit_binding: "unverified" };
  const output = resolve2(io.cwd, str(args.flags.output) ?? "doubleagent-simulation.json");
  await mkdir2(dirname3(output), { recursive: true });
  await writeFile2(output, JSON.stringify(report, null, 2) + "\n");
  if (args.flags.json) io.out(JSON.stringify(report, null, 2));
  else {
    io.out(`Completed ${report.actionsCompleted ?? 0} browser actions; captured ${report.snapshots?.length ?? 0} detector snapshots.`);
    const sessionIds = [...new Set(report.reporting.receipts?.map((receipt) => receipt.sessionId).filter(Boolean) ?? [])];
    if (sessionIds.length) io.out(`Find this SDK session in the dashboard: ${sessionIds.join(", ")}`);
    if (options.report) io.out(`Collection accepted: ${report.reporting.accepted ?? 0}; still pending: ${report.reporting.pending ?? 0}. Dashboard indexing is not verified by this command.`);
    io.out(`${report.status}: ${report.expectedSignal ?? "behavior observation"}; reporting ${report.reporting.outcome}. Report: ${output}`);
    io.out("Behavior patterns and markers do not verify provider identity. Human controls need a person in a normal browser.");
    for (const error of report.errors) io.err(error);
  }
  return report.status === "fail" ? 1 : 0;
}

// src/cli.ts
var HELP = `doubleagent: install Double Agent, manage sites and keys

Usage
  npx @doubleagent-so/cli init [--key pk_\u2026 | --email you@example.com [--domain host] [--test]]
                       [--profile auto] [--dry-run] [--yes] [--json] [--cwd dir]
  npx @doubleagent-so/cli verify <url> [--api origin] [--json]
  npx @doubleagent-so/cli simulate <url> [--scenario observe|bot|agent] [--headed] [--json]
  npx @doubleagent-so/cli agents resolve|list|remove [--site st_\u2026] [--json]
  npx @doubleagent-so/cli login | logout [--all]
  npx @doubleagent-so/cli sites [--json]
  npx @doubleagent-so/cli keys [list|create|rotate|revoke] [key_id] [--site st_\u2026] [--kind pk|sk] [--env live|test] [--json]
  npx @doubleagent-so/cli verify-domain <host> --method dns|meta|file|script [--site st_\u2026] [--json]
  npx @doubleagent-so/cli snippet <stack> [--key pk_\u2026] [--json]
  npx @doubleagent-so/cli create-account --email you@example.com [--domain host] [--json]

init           Installs the snippet. Without a key it installs keyless (claim the domain later to see data).
               --key sets a public key (or $DOUBLEAGENT_KEY); --email creates an account + site and uses its pk.
verify         Fetches <url>, checks the script tag, stub and key, and asks the API's install check.
login          Device-flow login; the session is saved to ~/.config/doubleagent/credentials.json (0600).
sites, keys    List sites; list, create, rotate or revoke keys (needs login).
verify-domain  Adds <host> to the site and verifies it (needs login).`;
var BOOL_FLAGS = /* @__PURE__ */ new Set(["dry-run", "yes", "y", "json", "help", "h", "test", "all", "headed", "report", "list", "install-browser", "resolve-identity", "sign-requests"]);
var VALUE_FLAGS = ["key", "email", "domain", "name", "profile", "site", "kind", "env", "method", "api", "portal", "cwd"];
var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function parseArgs(argv) {
  const out = { pos: [], flags: {} };
  for (let i2 = 0; i2 < argv.length; i2++) {
    const a = argv[i2];
    if (a.startsWith("--") || /^-[a-z]$/.test(a)) {
      const [k, v] = a.replace(/^-+/, "").split(/=(.*)/s, 2);
      if (v !== void 0) out.flags[k] = v;
      else if (BOOL_FLAGS.has(k) || i2 + 1 >= argv.length || argv[i2 + 1].startsWith("-")) out.flags[k] = true;
      else out.flags[k] = argv[++i2];
    } else if (!out.cmd) out.cmd = a;
    else out.pos.push(a);
  }
  return out;
}
var COMMANDS = {
  init,
  verify: verifyCmd,
  login,
  logout,
  sites,
  keys,
  "verify-domain": verifyDomain,
  snippet: snippetCmd,
  "create-account": createAccountCmd,
  simulate: simulateCmd,
  agents: agentsCmd
};
async function run(argv, io) {
  const args = parseArgs(argv);
  if (args.flags.help || args.flags.h || !args.cmd || args.cmd === "help") {
    io.out(args.cmd === "simulate" ? SIMULATE_HELP : args.cmd === "agents" ? AGENTS_HELP : HELP);
    return 0;
  }
  const cmd = COMMANDS[args.cmd];
  if (!cmd) {
    io.err(`unknown command "${args.cmd}"

${HELP}`);
    return 1;
  }
  try {
    const bare = VALUE_FLAGS.find((f) => args.flags[f] === true);
    if (bare) throw new CliError(`invalid --${bare}: expected a value`);
    return await cmd(args, io);
  } catch (e2) {
    const known = e2 instanceof InstallError || e2 instanceof CliError || e2 instanceof ApiError;
    const msg = known ? e2.message : e2.stack ?? String(e2);
    if (args.flags.json) io.out(JSON.stringify({ error: msg, ...e2 instanceof ApiError ? { code: e2.code, status: e2.status } : {} }, null, 2));
    else io.err(`error: ${msg}`);
    return e2 instanceof CliError ? e2.exitCode : 1;
  }
}
function guessDomain(p2) {
  const home = p2.pkg?.homepage;
  try {
    if (home) return new URL(home).hostname;
  } catch {
  }
  return p2.read("CNAME")?.trim().split(/\s/)[0] || p2.read("public/CNAME")?.trim().split(/\s/)[0] || void 0;
}
function nextSteps(c2) {
  const { stack, plan } = c2;
  if (stack.id === "shopify-theme") {
    return [
      "Add these tags once inside the head of layout/theme.liquid, before other scripts:",
      ...htmlSnippet({ key: c2.key, profile: c2.profile }).map((l) => `  ${l}`),
      "Save and publish the theme, then visit the storefront with a cart to check the _da_* cart attributes."
    ];
  }
  if (plan.status === "unsupported") {
    return ["Paste this into the <head> of every page, before other scripts:", ...htmlSnippet({ key: c2.key, profile: c2.profile }).map((l) => `  ${l}`)];
  }
  const site = c2.domain ?? "<your-domain>";
  const steps = [];
  if (c2.keyless) {
    steps.push(`Installed without a key. Claim ${site} at ${c2.claimUrl} to see retained data. Retention and collection limits apply.`);
  }
  steps.push(`Deploy, then run: npx @doubleagent-so/cli verify https://${site}`);
  if (c2.account) {
    const v = c2.account.verify;
    steps.push(`Confirm your email: check ${c2.email} for the login link${c2.account.login_url ? ` (or open ${c2.account.login_url})` : ""}.`);
    if (v?.token) steps.push(`Verify ${v.hostname ?? site} to see data: DNS TXT _doubleagent.${v.hostname ?? site} "da-verify=${v.token}" (then run: npx @doubleagent-so/cli login && npx @doubleagent-so/cli verify-domain ${v.hostname ?? site} --method dns)`);
  } else if (!c2.keyless) {
    steps.push(`Unlock the dashboard: npx @doubleagent-so/cli login, then npx @doubleagent-so/cli verify-domain ${site} --method dns`);
  } else {
    steps.push("Optional: npx @doubleagent-so/cli init --email you@example.com adds an account and key (live view, check()/tokens, webhooks).");
  }
  if (!c2.keyless) steps.push("Server side: verify tokens from doubleagent.getToken(action) with @doubleagent-so/node (createDoubleAgent().verifyToken) before trusting them.");
  return steps;
}
function readKey(args, io) {
  const given = str(args.flags.key) ?? io.env.DOUBLEAGENT_KEY;
  if (given === void 0) return void 0;
  if (SECRET_KEY_RE.test(given)) throw new InstallError("that is a secret key (sk_\u2026): it must never be put in client code. Use the site's public key (pk_\u2026).");
  if (!KEY_RE.test(given)) throw new InstallError(`"${given}" is not a public key (expected pk_live_\u2026 or pk_test_\u2026)`);
  return given;
}
async function init(args, io) {
  const asJson = !!args.flags.json;
  const cwd = resolve3(io.cwd, str(args.flags.cwd) ?? ".");
  const email = str(args.flags.email);
  const given = readKey(args, io);
  if (email && given) throw new InstallError("use either --email (creates a key) or --key, not both");
  if (email !== void 0 && !EMAIL_RE.test(email)) throw new InstallError(`"${email}" is not an email address`);
  const env = args.flags.test ? "test" : "live";
  const profile = str(args.flags.profile) ?? "auto";
  const dryRun = !!args.flags["dry-run"];
  const yes = !!(args.flags.yes || args.flags.y);
  const project = openProject(cwd);
  const stack = detectStack(project);
  const domain = str(args.flags.domain)?.toLowerCase() ?? guessDomain(project);
  const pending = `pk_${env}_PENDING`;
  const key = email ? pending : given;
  const plan = planInstall(project, stack, { key, profile });
  const integrations = detectIntegrations(project);
  const warnings = [];
  if (email && dryRun) warnings.push("dry run: no account is created; the diff shows a placeholder key");
  const diffs = plan.changes.map((c2) => unifiedDiff(c2.path, c2.before, c2.after));
  const claimUrl = `${portalBase(args, io)}/claim${domain ? `?domain=${encodeURIComponent(domain)}` : ""}`;
  if (!asJson) printHuman(io, stack, plan, integrations, diffs, warnings);
  let applied = false;
  let account;
  let finalKey = given;
  if (!dryRun) {
    const question = plan.changes.length ? `Apply ${plan.changes.length} change(s)${email ? ` and create an account for ${email}` : ""}? [Y/n] ` : void 0;
    if (question && !asJson && !yes && io.confirm && !await io.confirm(question)) {
      io.out("Aborted, nothing written.");
      return 1;
    }
    if (email) {
      account = await createAccount(args, io, { email, domain, name: str(args.flags.name) });
      finalKey = account.keys?.[`pk_${env}`] ?? account.keys?.pk_live ?? account.keys?.pk_test;
      if (!finalKey) throw new CliError("the account was created but the API returned no public key");
    }
    for (const c2 of plan.changes) {
      const abs = join4(cwd, c2.path);
      mkdirSync2(dirname4(abs), { recursive: true });
      writeFileSync2(abs, finalKey && email ? c2.after.split(pending).join(finalKey) : c2.after);
    }
    applied = plan.changes.length > 0;
  }
  const ctx = { stack, plan, profile, key: finalKey, keyless: !email && !given, domain, claimUrl, account, email };
  const steps = nextSteps(ctx);
  const code = plan.status === "unsupported" ? 2 : 0;
  if (asJson) {
    io.out(JSON.stringify({
      stack: stack.id,
      stack_label: stack.label,
      platform: stack.platform ?? null,
      status: plan.status,
      dry_run: dryRun,
      keyless: ctx.keyless,
      key: finalKey ?? null,
      domain: domain ?? null,
      claim_url: ctx.keyless ? claimUrl : null,
      files_changed: applied ? plan.changes.map((c2) => c2.path) : [],
      planned_changes: plan.changes.map((c2) => ({ path: c2.path, created: c2.before === null })),
      account: account ? { ...account, warning: "keys.sk_test is shown once: store it server-side, never in client code" } : null,
      integrations: integrations.map((i2) => i2.name),
      warnings,
      notes: plan.notes,
      next_steps: steps,
      diff: diffs.join("\n")
    }, null, 2));
    return code;
  }
  if (applied) io.out(`
Wrote ${plan.changes.map((c2) => c2.path).join(", ")}.`);
  else if (dryRun && plan.changes.length) io.out("\nDry run: nothing written.");
  if (account) {
    io.out(`
Created account ${account.account_id} with site ${account.site_id}; installed ${finalKey}.`);
    if (account.keys?.sk_test) io.out(`Test secret key (shown once, server-side only, never in client code):
  ${account.keys.sk_test}`);
  }
  io.out(`
Next steps:
${steps.map((s2) => s2.startsWith("  ") ? s2 : `  - ${s2}`).join("\n")}`);
  return code;
}
function printHuman(io, stack, plan, integrations, diffs, warnings) {
  io.out(`Stack: ${stack.label}${stack.platform ? ` (${stack.platform})` : ""}`);
  io.out(integrations.length ? `Integrations that will auto-activate: ${integrations.map((i2) => `${i2.name} (${i2.evidence})`).join(", ")}` : "Integrations that will auto-activate: none detected");
  for (const w of warnings) io.err(`warning: ${w}`);
  for (const n of plan.notes) io.out(`note: ${n}`);
  if (plan.status === "installed") io.out("Already installed: nothing to do.");
  if (plan.status === "unsupported") io.out("Could not detect a supported stack.");
  if (diffs.length) io.out(`
${diffs.join("\n")}`);
}
async function verifyCmd(args, io) {
  const url = args.pos[0];
  if (!url || !/^https?:\/\//.test(url)) throw new InstallError("verify needs an http(s) URL, e.g. npx @doubleagent-so/cli verify https://example.com");
  const r2 = await verify(url, { api: str(args.flags.api), fetch: io.fetch });
  if (args.flags.json) {
    io.out(JSON.stringify(r2, null, 2));
    return r2.ok ? 0 : 1;
  }
  const mark = (b) => b ? "ok  " : "FAIL";
  io.out(`${mark(r2.script)} script tag (cdn.doubleagent.so/v1/doubleagent.js)`);
  io.out(`${mark(r2.stub)} queue stub`);
  io.out(r2.keyless && r2.script ? "ok   keyless install (claim the domain to see its data)" : `${mark(r2.keyValid)} key ${r2.key ?? "(none)"}`);
  if (r2.integrations.length) io.out(`     integrations on page: ${r2.integrations.join(", ")}`);
  const ic = r2.installCheck;
  if (!ic.reachable) io.out(`     install check: API unreachable (${ic.error})`);
  else if (ic.status === 404) io.out("     install check: not available on this API yet");
  else if (ic.check) printInstallCheck(io, ic.check);
  else io.out(`     install check (${ic.status}): ${typeof ic.body === "string" ? ic.body : JSON.stringify(ic.body)}`);
  for (const p2 of r2.problems) io.err(`problem: ${p2}`);
  io.out(r2.ok ? "\nInstalled correctly." : "\nNot installed correctly.");
  return r2.ok ? 0 : 1;
}
function printInstallCheck(io, c2) {
  const yn = (b) => b === void 0 ? "?" : b ? "yes" : "no";
  io.out(`     install check: ${c2.ok === void 0 ? "no verdict" : c2.ok ? "ok" : "NOT ok"}`);
  if (c2.script_found !== void 0) io.out(`       script found: ${yn(c2.script_found)}${c2.script_src ? ` (${c2.script_src})` : ""}`);
  if (c2.keyless) io.out(`       keyless: yes${c2.claim_url ? ` (claim at ${c2.claim_url})` : ""}`);
  else if (c2.key !== void 0 || c2.key_valid !== void 0) io.out(`       key: ${c2.key ?? "?"} (valid: ${yn(c2.key_valid)})`);
  if (c2.profile_attr !== void 0) io.out(`       data-profile: ${c2.profile_attr}`);
  if (c2.stub_before_script !== void 0) io.out(`       stub before script: ${yn(c2.stub_before_script)}`);
  if (c2.integrations_detected?.length) io.out(`       integrations: ${c2.integrations_detected.join(", ")}`);
  if (c2.last_beacon_at !== void 0) io.out(`       last beacon: ${c2.last_beacon_at ?? "never"}`);
  for (const p2 of c2.problems ?? []) {
    io.out(`       problem: ${p2.message ?? p2.code ?? "unknown"}${p2.code && p2.message ? ` [${p2.code}]` : ""}`);
    if (p2.fix) io.out(`         fix: ${p2.fix}`);
  }
}

// src/main.ts
function ttyConfirm(p2) {
  if (!p2.stdin.isTTY || !p2.stdout.isTTY) return void 0;
  return async (q) => {
    const rl = createInterface({ input: p2.stdin, output: p2.stdout });
    try {
      return !/^n/i.test((await rl.question(q)).trim());
    } finally {
      rl.close();
    }
  };
}
async function main(p2, prefix = []) {
  const code = await run([...prefix, ...p2.argv.slice(2)], {
    cwd: p2.cwd(),
    env: p2.env,
    out: (s2) => p2.stdout.write(`${s2}
`),
    err: (s2) => p2.stderr.write(`${s2}
`),
    confirm: ttyConfirm(p2)
  });
  p2.exitCode = code;
  return code;
}

// src/skill-bin/simulate.ts
await main(process, ["simulate"]);
