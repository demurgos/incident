// tslint:disable:max-line-length
export interface Plain<D extends object, N extends string = string, C extends (Error | undefined) = (Error | undefined)> {
  message: string;
  name: N;
  data: D;
  cause: C;
  stack: string;
}

// tslint:disable:max-line-length
export interface Incident<D extends object, N extends string = string, C extends (Error | undefined) = (Error | undefined)>
  extends Error, Plain<D, N, C> {
  name: N;
  stack: string;

  toString(): string;
}

// tslint:disable:comment-format max-line-length typedef-whitespace space-within-parens
export interface StaticIncident {
  new<                  N extends string, C extends Error>(cause: C, name: N,          message?: string | ((data: object) => string)): Incident<object, N, C        >;
  new<                  N extends string                 >(          name: N,          message?: string | ((data: object) => string)): Incident<object, N, undefined>;
  new<D extends object, N extends string, C extends Error>(cause: C, name: N, data: D, message?: string | ((data: D     ) => string)): Incident<D,      N, C        >;
  new<D extends object, N extends string                 >(          name: N, data: D, message?: string | ((data: D     ) => string)): Incident<D,      N, undefined>;
     <                  N extends string, C extends Error>(cause: C, name: N,          message?: string | ((data: object) => string)): Incident<object, N, C        >;
     <                  N extends string                 >(          name: N,          message?: string | ((data: object) => string)): Incident<object, N, undefined>;
     <D extends object, N extends string, C extends Error>(cause: C, name: N, data: D, message?: string | ((data: D     ) => string)): Incident<D,      N, C        >;
     <D extends object, N extends string                 >(          name: N, data: D, message?: string | ((data: D     ) => string)): Incident<D,      N, undefined>;

  <D extends object, N extends string, C extends Error | undefined>(error: Error & {name: N; data: D; cause: C}): Incident<D,      N,      C        >;
                                                                   (error: Error                               ): Incident<object, string, undefined>;
}
// tslint:enable
