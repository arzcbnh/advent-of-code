return function(str, pattern)
    local arr = {}

    for slice in string.gmatch(str, "([^" .. pattern .. "]+)") do
        table.insert(arr, slice)
    end

    return arr
end
