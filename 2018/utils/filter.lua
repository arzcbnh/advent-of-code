return function(arr, callback)
    local res = {}

    for index, item in ipairs(arr) do
        if callback(item, index) then table.insert(res, item) end
    end

    return res
end
