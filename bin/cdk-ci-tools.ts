#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkCiToolsStack } from '../lib/cdk-ci-tools-stack';

const app = new cdk.App();
new CdkCiToolsStack(app, 'CdkCiToolsStack');
