/*
	Types
	Typescript types and interfaces referenced throughout the application
*/

export const localEnvironments = ["dev"];
export const remoteEnvironments = ["staging", "production"];
export const environments = [...localEnvironments, ...remoteEnvironments];
export type Environment = typeof environments[number];

export const projects = ["blueprint", "launch"];
export type Project = typeof projects[number];
