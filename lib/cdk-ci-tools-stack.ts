import { Stack, Construct, StackProps, SecretValue } from "@aws-cdk/core";
import { Pipeline, Artifact } from "@aws-cdk/aws-codepipeline";
import { PipelineProject } from "@aws-cdk/aws-codebuild";
import {
  GitHubSourceAction,
  CodeBuildAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { SimpleSynthAction } from "@aws-cdk/pipelines";

export class CdkCiToolsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const sourceOutput = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const sourceAction = new GitHubSourceAction({
      actionName: "GitHub_Source",
      owner: "grifhammer",
      repo: "cdk-ci-tools",
      oauthToken: SecretValue.secretsManager("GithubToken", {
        jsonField: "token",
      }),
      output: sourceOutput,
      branch: "develop", // default: 'master'
    });

    const project = new PipelineProject(this, "CDKPipelineBuilder");

    // How it will be built and synthesized
    const buildAction = SimpleSynthAction.standardNpmSynth({
      sourceArtifact: sourceOutput,
      cloudAssemblyArtifact,
      // We need a build step to compile the TypeScript Lambda
      buildCommand: "npm run build",
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
          actions: [buildAction],
        },
      ],
    });
  }
}
