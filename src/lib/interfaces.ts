export interface Attributes<Name extends string, Data extends {}, Cause extends (Error | undefined)> {
  message: string;
  name: Name;
  data: Data;
  cause: Cause;
  stack: string;
}

export interface Incident<Name extends string, Data extends {}, Cause extends (Error | undefined)>
  extends Error, Attributes<Name, Data, Cause> {
  name: Name;
  stack: string;

  toString(): string;
}

/* tslint:disable:comment-format max-line-length typedef-whitespace */
export interface StaticIncident extends Function {
//new<                                C extends Error>(cause: C                                                              ): Incident<"Incident", {}, C        >;
  new<                                C extends Error>(cause: C,                   message : string | ((data?: {}) => string)): Incident<"Incident", {}, C        >;
//new<N extends string,               C extends Error>(cause: C, name: N,                                                    ): Incident<N,          {}, C        >;
  new<N extends string,               C extends Error>(cause: C, name: N,          message : string | ((data?: {}) => string)): Incident<N,          {}, C        >;
  new                                                 (                            message?: string | ((data?: {}) => string)): Incident<"Incident", {}, undefined>;
//new<N extends string                               >(          name: N,                                                    ): Incident<N,          {}, undefined>;
  new<N extends string                               >(          name: N,          message : string | ((data?: {}) => string)): Incident<N,          {}, undefined>;
  new<N extends string, D extends {}, C extends Error>(cause: C, name: N, data: D, message?: string | ((data?: D) => string) ): Incident<N,          D,  C        >;
  new<                  D extends {}, C extends Error>(cause: C,          data: D, message?: string | ((data?: D) => string) ): Incident<"Incident", D,  C        >;
  new<N extends string, D extends {}                 >(          name: N, data: D, message?: string | ((data?: {}) => string)): Incident<N,          D,  undefined>;
  new<                  D extends {}                 >(                   data: D, message?: string | ((data?: D ) => string)): Incident<"Incident", D,  undefined>;

     <N extends string, D extends {}, C extends Error | undefined>(error: Error & {name: N, data?: D, cause?: C}             ): Incident<N,          D,  C        >;
                                                                  (error: Error                                              ): Incident<string,     {}, undefined>;

     <                                C extends Error>(cause: C,                   message : string | ((data?: {}) => string)): Incident<"Incident", {}, C        >;
//   <N extends string,               C extends Error>(cause: C, name: N,                                                    ): Incident<N,          {}, C        >;
     <N extends string,               C extends Error>(cause: C, name: N,          message : string | ((data?: {}) => string)): Incident<N,          {}, C        >;
                                                      (                            message?: string | ((data?: {}) => string)): Incident<"Incident", {}, undefined>;
//   <N extends string                               >(          name: N,                                                    ): Incident<N,          {}, undefined>;
     <N extends string                               >(          name: N,          message : string | ((data?: {}) => string)): Incident<N,          {}, undefined>;
     <N extends string, D extends {}, C extends Error>(cause: C, name: N, data: D, message?: string | ((data?: D) => string) ): Incident<N,          D,  C        >;
     <                  D extends {}, C extends Error>(cause: C,          data: D, message?: string | ((data?: D) => string) ): Incident<"Incident", D,  C        >;
     <N extends string, D extends {}                 >(          name: N, data: D, message?: string | ((data?: {}) => string)): Incident<N,          D,  undefined>;
     <                  D extends {}                 >(                   data: D, message?: string | ((data?: D ) => string)): Incident<"Incident", D,  undefined>;
}
