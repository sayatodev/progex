list = [9,7,5,3,8,6,4,2]
print(list)
for i in range(len(list)):
    for j in range(i+1,len(list)):
        if list[i] > list[j]:
            print(list[i], ">", list[j], "swapping")
            tmp = list[i]
            list[i] = list[j]
            list[j] = tmp
            print("swapped     ", list)
    print("After i = ",i,list)

print(list)