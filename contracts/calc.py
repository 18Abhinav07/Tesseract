admin_m=0x0731c89500
pk2_m=0x06fe05c215
key2_m=0x010717f6b043
key3_m=0x007c3d6559b3
total_m=admin_m+pk2_m+key2_m+key3_m
target=total_m//4
print('Target each mUSDC atoms:',target,'=',target/1e6,'mUSDC')
print('KEY2 send to ADMIN:',key2_m-target)
print('KEY3 send to ADMIN:',key3_m-target)
print('PK2 mint needed:',target-pk2_m)
print('ADMIN mint needed:',target-admin_m)
T=2000*10**18
pk2_p=5049982196414000000000
key2_p=4699462292276500000000
key3_p=19779617000000000000
print('PK2 send PAS to admin (wei):',pk2_p-T)
print('KEY2 send PAS to admin (wei):',key2_p-T)
print('ADMIN send PAS to KEY3 (wei):',T-key3_p)
