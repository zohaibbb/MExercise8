function checkFulda(str)
{
    if(str.includes('f') && str.includes('u') && str.includes('l') 
    && str.includes('d') && str.includes('a') )
    {
        console.log("True is the right way")
    }
    else{
        console.log("False is the wrong way")

    }

}

checkFulda('someOtherValue')