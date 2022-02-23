const usdMoneyFormat = new Intl.NumberFormat('en-US', {'currency': 'usd'})

export function format_usd(value) {
    if (!value) {
        return '';
    }
    var res = String(value).replace(/Rs. |,/g, '');
    return '$' + usdMoneyFormat.format(res)
}

export function usd_to_int(value) {
    if (!value) {
        return 0;
    }
    var res = String(value).replace(/Rs. |,/g, '');
    return parseInt(res.replace("$", "").replace(",", ""));
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
