return function(arr, callback)
    local res = {}

    for index, item in ipairs(arr) do
        table.insert(res, callback(item, index))
    end

    return res
end
