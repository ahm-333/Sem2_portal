#include <iostream>
using namespace std;

// ============================================================================
// مادة هياكل البيانات والخوارزميات (Data Structures)
// سكشن هيكل المكدس الديناميكي (Dynamic Stack Implementation with Templates)
// إعداد وشرح: م.م. أحمد حسام
// ============================================================================

template <typename T>
class DynamicStack
{
private:
    T* arr;
    size_t capacity;
    int top;

    void resize(size_t new_capacity)
    {
        T* newArray = new T[new_capacity];

        for (size_t i = 0; i <= top; i++)
        {
            newArray[i] = arr[i];
        }

        delete[] arr;
        arr = newArray;
        capacity = new_capacity;
    }

public:
    DynamicStack(size_t cap)
    {
        capacity = cap;
        top = -1;
        arr = new T[capacity];
    }

    ~DynamicStack()
    {
        delete[] arr;
    }

    bool isEmpty()
    {
        return top == -1;
    }

    bool isFull()
    {
        return top == capacity - 1;
    }

    void push(const T& value)
    {
        if (isFull())
        {
            resize(2 * capacity);
        }
        arr[++top] = value;
        cout << value << " pushed Successfully" << endl;
    }

    T pop()
    {
        if (isEmpty())
        {
            cout << "The stack is empty" << endl;
            return T();
        }

        return arr[top--];
    }

    T peek()
    {
        if (isEmpty())
        {
            cout << "The stack is empty" << endl;
            return T();
        }

        return arr[top];
    }
};

int main()
{
    cout << "=== تجربة هيكل البيانات DynamicStack ===" << endl;
    DynamicStack<int> s(2);

    s.push(10);
    s.push(20);
    s.push(30); // ستقوم الدالة resize بمضاعفة السعة تلقائياً

    cout << "Top element is: " << s.peek() << endl;

    cout << s.pop() << " popped" << endl;
    cout << s.pop() << " popped" << endl;
    cout << s.pop() << " popped" << endl;
    cout << s.pop() << " popped (underflow test)" << endl;

    return 0;
}
