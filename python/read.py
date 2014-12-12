import nxppy
import time

mifare = nxppy.Mifare()
print "Listening for NFC..."
while True:
	time.sleep(0.3)
	try:
		uid = mifare.select() # Select the first available tag and return the UID
		if(uid):
			print "ID " + uid
		#break
	except nxppy.SelectError:
		continue
		#print "no valid UID"
#print uid
# Read 16 bytes starting from block 10 (each block is 4 bytes, so technically this reads blocks 10-13)
# block = mifare.read_block(0)
# print block
