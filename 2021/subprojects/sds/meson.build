project('sds', 'c')

inc = include_directories('.')
lib = shared_library('sds', 'sds.c', include_directories: inc)

main_dep = declare_dependency(include_directories: inc, link_with: lib)