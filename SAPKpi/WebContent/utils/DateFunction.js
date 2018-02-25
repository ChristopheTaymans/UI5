addDateMonate : function( pDatum, pAnzahlMonate )

{
    if ( pDatum === undefined )
    {
        return undefined;
    }

    if ( pAnzahlMonate === undefined )
    {
        return pDatum;
    }

    var vv = new Date();

    var jahr = pDatum.getFullYear();
    var monat = pDatum.getMonth() + 1;
    var tag = pDatum.getDate();

    var add_monate_total = Math.abs( Number( pAnzahlMonate ) );

    var add_jahre = Number( Math.floor( add_monate_total / 12.0 ) );
    var add_monate_rest = Number( add_monate_total - ( add_jahre * 12.0 ) );

    if ( Number( pAnzahlMonate ) > 0 )
    {
        jahr += add_jahre;
        monat += add_monate_rest;

        if ( monat > 12 )
        {
            jahr += 1;
            monat -= 12;
        }
    }
    else if ( Number( pAnzahlMonate ) < 0 )
    {
        jahr -= add_jahre;
        monat -= add_monate_rest;

        if ( monat <= 0 )
        {
            jahr = jahr - 1;
            monat = 12 + monat;
        }
    }

    if ( ( Number( monat ) === 2 ) && ( Number( tag ) === 29 ) )
    {
        if ( ( ( Number( jahr ) % 400 ) === 0 ) || ( ( Number( jahr ) % 100 ) > 0 ) && ( ( Number( jahr ) % 4 ) === 0 ) )
        {
            tag = 29;
        }
        else
        {
            tag = 28;
        }
    }

    return new Date( jahr, monat - 1, tag );
}