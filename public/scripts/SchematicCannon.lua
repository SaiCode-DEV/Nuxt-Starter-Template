-- SchematicCannon Auto-Supply Script
-- Automatically supplies missing items to Schematic Cannon via ME System
-- Peripherals: ME Bridge (front), Chatbox (right), Block Reader (back)

local meBridge = peripheral.wrap("front")
local chatbox = peripheral.wrap("right")
local blockReader = peripheral.wrap("back")

-- Configuration
local PLAYER_NAME = "SaiCode"
local CHECK_INTERVAL = 5 -- seconds between checks
local MAX_EXPORT_AMOUNT = 64 -- maximum items to export at once

-- Chat function to notify player
local function notifyPlayer(message)
    if chatbox then
        chatbox.sendMessageToPlayer(message, PLAYER_NAME)
        print("[CHAT] " .. message)
    else
        print("[ERROR] Chatbox not found!")
    end
end

-- Get schematic cannon data
local function getCannonData()
    if not blockReader then
        print("[ERROR] Block reader not found!")
        return nil
    end
    
    local success, data = pcall(function()
        return blockReader.getBlockData()
    end)
    
    if not success then
        print("[ERROR] Failed to read cannon data: " .. tostring(data))
        return nil
    end
    
    return data
end

-- Check if item is available in ME system
local function isItemAvailable(itemId, count)
    if not meBridge then
        print("[ERROR] ME Bridge not found!")
        return false, 0
    end
    
    local success, item = pcall(function()
        return meBridge.getItem({name = itemId})
    end)
    
    if not success then
        print("[ERROR] Failed to get item info: " .. tostring(item))
        return false, 0
    end
      if item and item.count then
        return true, item.count
    end
    
    return false, 0
end

-- Export item from ME system
local function exportItem(itemId, count)
    if not meBridge then
        print("[ERROR] ME Bridge not found!")
        return false
    end
      -- Try to export to a chest (not directly to cannon)
    local success, result = pcall(function()
        return meBridge.exportItem({
            name = itemId,
            count = count
        }, "back")
    end)
    
    if success and result > 0 then
        print("[SUCCESS] Exported " .. result .. "x " .. itemId)
        return true
    else
        print("[ERROR] Failed to export " .. itemId .. ": " .. tostring(result))
        return false
    end
end

-- Try to craft item if not available
local function craftItem(itemId, count)
    if not meBridge then
        return false
    end
    
    local success, result = pcall(function()
        return meBridge.craftItem({
            name = itemId,
            count = count
        })
    end)
    
    if success and result then
        print("[CRAFTING] Started crafting " .. count .. "x " .. itemId)
        notifyPlayer("Started crafting " .. count .. "x " .. itemId)
        return true
    else
        print("[ERROR] Failed to start crafting " .. itemId)
        return false
    end
end

-- Main processing function
local function processMissingItem()
    local cannonData = getCannonData()
    
    if not cannonData then
        return
    end
    
    -- Check if cannon is missing items
    if cannonData.Status ~= "missingBlock" or not cannonData.MissingItem then
        print("[INFO] No missing items")
        return
    end
    
    local missingItem = cannonData.MissingItem
    local itemId = missingItem.id
    local requiredCount = missingItem.count
    
    print("[INFO] Missing item: " .. itemId .. " x" .. requiredCount)
      -- Check if item is available in ME system
    local available, stockCount = isItemAvailable(itemId, requiredCount)
    
    -- Ensure stockCount is never nil
    stockCount = stockCount or 0    if available and stockCount >= requiredCount then
        -- Export the item - always export at least 32 items to make restocking efficient
        local exportCount = math.min(math.max(32, requiredCount), MAX_EXPORT_AMOUNT, stockCount)
        
        if exportItem(itemId, exportCount) then
            notifyPlayer("Supplied " .. exportCount .. "x " .. itemId .. " to chest")
        else
            notifyPlayer("Failed to export " .. itemId .. " - check ME system connection")
        end
    elseif available and stockCount > 0 then
        -- Partial stock available - export what we have, minimum 32 if possible
        local exportCount = math.min(math.max(32, stockCount), stockCount)
        
        if exportItem(itemId, exportCount) then
            notifyPlayer("Partially supplied " .. exportCount .. "x " .. itemId .. " to chest")
        end
        
        -- Try to craft the remaining amount
        local craftAmount = math.max(32, requiredCount) - exportCount
        if craftAmount > 0 and not craftItem(itemId, craftAmount) then
            notifyPlayer("Cannot craft remaining " .. craftAmount .. "x " .. itemId)
        end
    else        -- Item not available, try to craft at least 32
        local craftAmount = math.max(32, requiredCount)
        if not craftItem(itemId, craftAmount) then
            notifyPlayer("Missing item: " .. itemId .. " x" .. requiredCount .. " - not available in ME system and cannot craft!")
        end
    end
end

-- Main loop
local function main()
    print("=== Schematic Cannon Auto-Supply System ===")
    print("ME Bridge: " .. (meBridge and "OK" or "NOT FOUND"))
    print("Chatbox: " .. (chatbox and "OK" or "NOT FOUND"))
    print("Block Reader: " .. (blockReader and "OK" or "NOT FOUND"))
    print("=====================================")
    
    if not meBridge or not chatbox or not blockReader then
        print("[ERROR] Missing required peripherals!")
        return
    end
    
    notifyPlayer("Schematic Cannon Auto-Supply System started")
    
    while true do
        local success, error = pcall(processMissingItem)
        
        if not success then
            print("[ERROR] " .. tostring(error))
            notifyPlayer("Auto-supply system error: " .. tostring(error))
        end
        
        sleep(CHECK_INTERVAL)
    end
end

-- Error handling wrapper
local function safeMain()
    local success, error = pcall(main)
    if not success then
        print("[FATAL ERROR] " .. tostring(error))
        if chatbox then
            notifyPlayer("Auto-supply system crashed: " .. tostring(error))
        end
    end
end

-- Start the program
safeMain()