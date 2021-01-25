import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as CdkCiTools from "../lib/cdk-ci-tools-stack";

test("CI Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkCiTools.CdkCiToolsStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.SUPERSET
    )
  );
});
