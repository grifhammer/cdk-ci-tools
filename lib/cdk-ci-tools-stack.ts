import * as cdk from "@aws-cdk/core";
import { Pipeline, Artifact } from "@aws-cdk/aws-codepipeline";
import { PipelineProject } from "@aws-cdk/aws-codebuild";
import {
  GitHubSourceAction,
  CodeBuildAction,
} from "@aws-cdk/aws-codepipeline-actions";
export class CdkCiToolsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const sourceOutput = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: "GitHub_Source",
      owner: "grifhammer",
      repo: "cdk-ci-tools",
      oauthToken: cdk.SecretValue.secretsManager("GithubAccessToken"),
      output: sourceOutput,
      branch: "develop", // default: 'master'
    });

    const project = new PipelineProject(this, "CDKPipelineBuilder");

    const codebuildAction = new CodeBuildAction({
      input: sourceOutput,
      actionName: "cdkBuild",
      project,
    });

    const pipeline = new Pipeline(this, "Pipeline", {
      pipelineName: "SetlistPipeline",
      stages: [
        {
          stageName: "source",
          actions: [sourceAction],
        },
        {
          stageName: "build",
          actions: [codebuildAction],
        },
      ],
    });
    // pipeline.addStage({ stageName: "test", actions: [codebuildAction] });
  }
}
