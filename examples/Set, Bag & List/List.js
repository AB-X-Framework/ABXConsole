/**
 * List wrapper around array
 * Given element x, and List A, B, you can use:
 *
 * You can create using
 * List(x,y,z) or
 * arrayToList([x, y, z])
 *
 * List methods:
 * A.isEmpty() to check if list is empty
 * A.size() to get list size
 * A.sort( f(x)):
 *   Creates a sorted list with by increasing order of the result of f(x).
 * A.maps(f(x)) Creates new list with results f(x).
 * A.any(f(x)) Returns true if any element is true of f(x)
 * A.first(f(x)) Returns the first found element which is true for f(x)
 * A.reduce(f(x), defaultValue)
 *   Reduces this list applying recursively f(x) to the element and the result.
 *   default value is the initial value
 * A.every(f(x)) Returns true if all the elements are true of f(x)
 * A.filter(f(x)) Creates new list with only the elements which are true for f(x).
 * A.each(f(x)) Executes f(x) for each element. Return same list
 * A.append(x): Appends x to A list. Returns same list.
 * A.appendAll(B): Appends all elements of B to the A list. Returns A list.
 * A.remove(x): Removes x from A list. Returns same list.
 * A.sum(attr?): Calculates the sum of element values using reduce with default value being 0.
 *   If attr is not undefined, then it is the sum of attr of all elements
 * A.avg(attr?): Calculates the average using sum and the size methods.
 *  If attr is not undefined, then it is the avg of attr of all elements
 */
addTest("List Testing",()=>{

    let a = List(1,2,3);
    let b= arrayToList([1,2,3]);

    Assertions.assertEquals(a,b);

    Assertions.assertEquals(1, a.worst());
    Assertions.assertEquals(3, a.best());

    const worst = {"name":"z","val":1};
    let complexList = List(worst,
        {"name":"d","val":2},
        {"name":"c","val":3});

    Assertions.assertEquals(worst, complexList.worst("val"));

    Assertions.assertEquals("c", complexList.best(elem=>elem.val).name);

    b.append(5);
    a.append(5);
    Assertions.assertEquals(List(1,2,3,5),a);
    Assertions.assertEquals(List(1,2,3,5),b);

    b.append(5);
    Assertions.assertEquals(List(1,2,3,5,5),b);

    b.remove(5);
    Assertions.assertEquals(List(1,2,3,5),b);

    b.append(5);
    Assertions.assertEquals(List(1,2,3,5,5),b);

    b.removeAll(5);
    Assertions.assertEquals(List(1,2,3),b);

    b.append(5);
    Assertions.assertEquals(Set(1,2,3,5),b.toSet());

    b.append(5);
    Assertions.assertEquals(Bag(1,2,3,5,5),b.toBag());
    Assertions.assertEquals(Set(1,2,3,5),b.toSet());


    Assertions.assertTrue(b.any(elem=>elem>2));
    Assertions.assertFalse(b.any(elem=>elem>20));
    Assertions.assertEquals(List(1,2,3).sum(),6);
    Assertions.assertEquals(List(1,2,3).avg(),2);


    Assertions.assertEquals(List(3,4,5),List(1,2,3).maps(x=>x+2));
    Assertions.assertEquals(List(3,4),List(3,4,5,6,5675).filter(x=>x<5));

    let counter=0;
    List(1,2,3).each(x=>{counter+=x});
    Assertions.assertEquals(6,counter);

    complexList = List(
        {"name":"a","val":1},
        {"name":"b","val":2},
        {"name":"c","val":6});
    Assertions.assertEquals(complexList.sum("val"),9);
    Assertions.assertEquals(complexList.avg("val"),3);
});