return function(arr, check)
    for _, item in ipairs(arr) do
        if check(item) then
            return item
        end
    end
end
