project('c-vector', 'c')

inc = include_directories('.')
lib = static_library('c-vector', 'vec.c', include_directories: inc)

main_dep = declare_dependency(include_directories: inc, link_with: lib)