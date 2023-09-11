zeek.on('zeek_init', () => {
    let have_major_version = parseInt(process.version.match(/^v(\d+)/)[1]);

    let eq_or_newer = parseInt(process.env['WANT_EQ_OR_NEWER']);
    let eq_or_older = parseInt(process.env['WANT_EQ_OR_OLDER']);

    if ( !isNaN(eq_or_newer) ) {
        console.log(`eq_or_newer = ${eq_or_newer}`);
        if ( have_major_version >= eq_or_newer ) {
            zeek.invoke('exit', [0]);
        }
        zeek.invoke('exit', [1]);
    } else if ( !isNaN(eq_or_older) ) {
        console.log(`eq_or_older = ${eq_or_older}`);
        if ( have_major_version <= eq_or_older ) {
            zeek.invoke('exit', [0]);
        }
        zeek.invoke('exit', [1]);
    } else {
        console.log(`usage is to run the script with either WANT_EQ_OR_NEWER or WANT_EQ_OR_OLDER environment variable set to a nodejs major version`);
    }
    
    zeek.invoke('exit', [1]);
});
