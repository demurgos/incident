import chai from "chai";
import { Incident } from "../lib/index";

// tslint:disable-next-line:max-line-length
export interface IncidentLike<D extends object, N extends string = string, C extends (Error | undefined) = (Error | undefined)> {
  message: string;
  name: N;
  data: D;
  cause?: C;
  stack?: string;
}

// tslint:disable-next-line:max-line-length
export function assertEqualErrors<D extends object, N extends string = string, C extends (Error | undefined) = (Error | undefined)>(
  actual: Incident<D, N, C>,
  expected: IncidentLike<D, N, C>,
): void | never {
  for (const key in expected) {
    const actualProperty: any = (<any> actual)[key];
    const expectedProperty: any = (<any> expected)[key];
    chai.assert.deepEqual(
      actualProperty,
      expectedProperty,
      `Expected \`${actualProperty}\` to be \`${expectedProperty}\` for ${key}`,
    );
  }
}
