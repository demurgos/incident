import { assert } from "chai";
import { Incident } from "../lib/index";

export interface IncidentLike<N extends string, D extends {}, C extends (Error | undefined)> {
  message: string;
  name: N;
  data: D;
  cause?: C;
  stack?: string;
}

export function assertEqualErrors<N extends string, D extends {}, C extends (Error | undefined)>(
  actual: Incident<N, D, C>,
  expected: IncidentLike<N, D, C>,
): void | never {
  for (const key in expected) {
    const actualProperty: any = (<any> actual)[key];
    const expectedProperty: any = (<any> expected)[key];
    assert.deepEqual(
      actualProperty,
      expectedProperty,
      `Expected \`${actualProperty}\` to be \`${expectedProperty}\` for ${key}`,
    );
  }
}
