
struct node {
    int data;
    struct node *next;
};

typedef struct list {
    struct node *head;
    int size;
} List;
int main(int argc, char **argv) {
  l->size++;                                        // gdb script breaks here
}