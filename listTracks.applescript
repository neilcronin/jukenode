on run argv
	set stdout to ""
	tell application "iTunes"
		set mySongs to get (every track of playlist (item 1 of argv))
		repeat with a_track in mySongs
			set stdout to stdout & (database ID of a_track) & "\\" & �
				(name of a_track) & "\\" & �
				(album of a_track) & "\\" & �
				(artist of a_track) & "\\" & �				
				(year of a_track) & "\\" & �
				(bit rate of a_track) & "\\" & �
				(time of a_track) & "\\" & �
				"
"
		end repeat
	end tell
end run
