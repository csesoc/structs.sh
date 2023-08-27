/**
 * Backend data structure definition
 */
export type Addr = `0x${string}`;
export enum CType {
  DOUBLE_LINED_LIST_NODE = 'struct doubly_list_node',
  SINGLE_LINED_LIST_NODE = 'struct node',
  INT = 'int',
  DOUBLE = 'double',

  CHAR = 'char',
}

export type DoublePointerVariable = {
  value: string;
  prev: Addr;
  next: Addr;
};

export type SinglePointerVariable = {
  value: string;
  next: Addr;
};
export type IntVariable = number;
export type DoubleVariable = number;
export type CharVariable = string;

export type BackendVariable =
  | DoublePointerVariable
  | SinglePointerVariable
  | IntVariable
  | DoubleVariable
  | CharVariable;

export type IsPointerType = true | false;
export interface BackendVariableBase {
  addr: Addr;
  data: Addr | BackendVariable;
  type: CType;
  is_pointer: IsPointerType;
}

export interface BackendVariablePointer extends BackendVariableBase {
  data: Addr;
  type: CType;
  is_pointer: true;
}

export interface BackendVariableBaseInt extends BackendVariableBase {
  data: IntVariable;
  type: CType.INT;
  is_pointer: false;
}

export interface BackendVariableBaseDouble extends BackendVariableBase {
  data: DoubleVariable;
  type: CType.DOUBLE;
  is_pointer: false;
}

export interface BackendVariableBaseChar extends BackendVariableBase {
  data: CharVariable;
  type: CType.CHAR;
  is_pointer: false;
}

export interface BackendVariableBaseDoubleLinkedList extends BackendVariableBase {
  data: DoublePointerVariable;
  type: CType.DOUBLE_LINED_LIST_NODE;
  is_pointer: false;
}

export interface BackendVariableBaseSingleLinkedList extends BackendVariableBase {
  data: SinglePointerVariable;
  type: CType.SINGLE_LINED_LIST_NODE;
  is_pointer: false;
}

export type BackendVariableNonPointerConcrete =
  | BackendVariableBaseInt
  | BackendVariableBaseDouble
  | BackendVariableBaseChar
  | BackendVariableBaseDoubleLinkedList
  | BackendVariableBaseSingleLinkedList;

// data: 0X78
// size: 3
// 0x78, 0x7C, 0x80, 0x84
export interface BackendVariableBasePointer extends BackendVariableBase {
  data: Addr;
  type: CType;
  is_pointer: true;
  size: number;
}

export type BackendVariableConcrete = BackendVariablePointer | BackendVariableNonPointerConcrete;

export interface BackendState {
  data: {
    [address: Addr]: BackendVariableConcrete;
  };
  type: {
    [name: string]: CStruct;
  };
}

export interface BackendUpdate {
  modified: {
    [address: Addr]: BackendVariableConcrete;
  };
  removed: Addr[];
}

/**
 * Code editor definition for user's own defined struct
 */
export type LinkedListType = {
  linkedListStruct: string;
  value: {
    type: 'int';
    name: 'cockatoo';
    isPointer: false;
  };
  next: {
    type: 'struct pigeon';
    name: 'magpie';
    isPointer: true;
  };
};

export interface EditorAnnotation {
  [name: string]: LinkedListType;
}

export interface CStruct {
  name: string;
  fields : {
    [propertyName: string]: string;
  }
}


export interface Annotation {
  cStructName: string;
  type: CType | null;
  mapping: {
    [propertyName: string]: string;
  }
}

export interface Annotations {
  [name: string]: Annotation;
}