function checkotp(code, otp) {
    if (code !== otp) {
        return false;

    }
    return true;


}

module.exports = checkotp ; 