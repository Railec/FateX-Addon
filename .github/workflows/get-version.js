const tagVersion = process.argv[2].split('/').slice(-1)[0];
if(!tagVersion || !tagVersion.toLowerCase().startsWith('v')) {
	console.error(`Invalid version specified: ${tagVersion}`);
	process.exitCode = 1;
} else {
	console.log(tagVersion.substring(1)); //strip v-prefix and log to output.
}