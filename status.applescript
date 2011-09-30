set stdout to ""
tell application "iTunes"
	if player state of application "iTunes" is playing then
		set a_track to current track
		set stdout to stdout & (database ID of a_track) & "\\" & �
			(name of a_track) & "\\" & �
			(album of a_track) & "\\" & �
			(artist of a_track) & "\\" & �
			(year of a_track) & "\\" & �
			(bit rate of a_track) & "\\" & �
			(time of a_track) & "\\" & �
			(duration of a_track) & "\\" & �		 
			(player state of application "iTunes") & "\\" & �
			(player position of application "iTunes") & "\\"
	else
		set stdout to stdout & (player state of application "iTunes")
	end if
end tell