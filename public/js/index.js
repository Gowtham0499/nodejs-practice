$(document).ready(function(){
    $('.delete-todo').on('click', function(){
        var id = $(this).data('id');
        var url = '/delete/' + id;
        if(confirm('Delete Todo?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting Todo with ID....' + id);
                    window.location.href='/';
                },
                error: function(err){
                    console.log('Error occured!' + err);
                }
            });
        }
    });

    $('.edit-todo').on('click', function(){
        $('#edit-form-id').val($(this).data('id'));
        $('#edit-form-todo').val($(this).data('todo'));
        $('#edit-form-description').val($(this).data('description'));
    });
});