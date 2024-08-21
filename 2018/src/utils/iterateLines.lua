return function(str)
    return string.gmatch(str, "[^\r\n]+")
end
